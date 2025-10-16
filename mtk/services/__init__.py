import base64
import dataclasses
import json

import requests
from cryptography.fernet import Fernet
from decouple import config

from internet_service_provider import settings
from mtk.services._types import MtkResponseObject, MtkPayload

fernet = Fernet(settings.FERNET_KEY.encode())


@dataclasses.dataclass
class ValidPayload:
    mtk: int
    auth: str
    timestamp: str


def validate(encoded_payload) -> ValidPayload:
    encrypted_payload = base64.urlsafe_b64decode(encoded_payload).decode()
    json_payload = fernet.decrypt(encrypted_payload.encode()).decode()
    payload = json.loads(json_payload)
    if not isinstance(payload, dict):
        raise ValueError("Payload is not a valid JSON object.")
    required_keys = ['mtk', 'auth', 'timestamp']
    for key in required_keys:
        if key not in payload:
            raise ValueError(f"Missing key: {key}")

    info = payload.copy()
    if not isinstance(info, dict):
        raise ValueError("`info` must be a dictionary.")
    if 'mtk' not in info or 'auth' not in info:
        raise ValueError("Missing `mtk` or `auth` in `info`.")

    if not isinstance(payload['timestamp'], str):
        raise ValueError("`timestamp` must be a string.")
    return ValidPayload(**info)


class NetWokException(Exception):
    pass


class ScriptManager:
    ...

    def rsc(self, payload: dict, host: str = None) -> tuple[str, str, str]:
        json_payload = json.dumps(payload)
        encrypted_payload = fernet.encrypt(json_payload.encode()).decode()
        encoded_payload = base64.urlsafe_b64encode(encrypted_payload.encode()).decode()
        rsc_file = settings.RSC_FILE
        provisioning_url = f"{host}/api/v1/equipments/auth/{encoded_payload}/"
        return f""":do {{
                        :local url "{provisioning_url}";

                        /tool fetch url=$url dst-path={rsc_file};
                        :delay 2s;
                        /import {rsc_file};
                    }} on-error={{
                        :put "Error occurred during configuration. Check internet and retry.";
                    }}""", provisioning_url, rsc_file


class NetworkService:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.config = {"response": "json"}

    def dispatch(self, endpoint, method="POST", **data):
        try:
            res = requests.request(method, f"{self.base_url}/api/{endpoint}",
                                   headers={"Content-Type": "application/json",
                                            "User-Agent": "F2Net/1.0 (https://f2net.fronttocodelabs.com)",
                                            "x-api-key": config("MTK_API_KEY", default="")
                                            },
                                   json=data)
            if self.config["response"] == "json":
                res = res.json()
            elif self.config["response"] == "text":
                res = res.text
            else:
                raise ValueError("Invalid response type")
            return res
        except:
            raise NetWokException("Network connection error")

    @property
    def text(self):
        self.config["response"] = "text"
        return self


class Mtk:
    instance: "Mtk" = None

    def __init__(self, base_url: str):
        self.net = NetworkService(base_url)
        self.script = ScriptManager()
        self.config = {}
        self._init_info()

    @classmethod
    def init(cls, *, host: str):
        Mtk.instance = Mtk(host)

    @classmethod
    def get(cls):
        return Mtk.instance

    @classmethod
    def destroy(cls):
        Mtk.instance = None

    @classmethod
    def provision(cls, name: str) -> MtkResponseObject[MtkPayload | None]:
        """
        Provisions a new VPN client with the given name.

        Expects:
            name (str): The desired client name.

        Returns:
            MtkResponseObject: A response object indicating the result of the operation.
            The response may have one of the following structures:

            On failure:
                {
                    "error": "Internal server error",
                    "success": false
                }

            On success:
                {
                    "certificate_created": true,
                    "client_name": "kjsxbsdsddahsdddas820ss9",
                    "config_file_available": true,
                    "created_at": "2025-06-27T20:19:37.904189",
                    "message": "VPN client \"kjsxbsdsddahsdddas820ss9\" created successfully",
                    "success": true
                }

        Example:
            response = YourClass.provision("client123")
            if response.success:
                print(response.message)
        """
        res = Mtk.instance.net.dispatch("vpn/clients/create", client_name=name)
        response = MtkResponseObject()

        # Map the response fields to MtkResponseObject fields
        if "error" in res:
            response.error = res.get("error")

        response.success = res.get("success", False)
        response.message = res.get("message")

        # Additional fields that might be useful
        if "client_name" in res:
            response.payload = MtkPayload(
                client_name=res.get("client_name"),
                certificate_created=res.get("certificate_created"),
                config_file_available=res.get("config_file_available"),
                created_at=res.get("created_at"),
            )

        return response

    @classmethod
    def provision_script(cls, payload: dict, host: str) -> tuple[str, str, str]:
        return cls.instance.script.rsc(payload, host)

    @classmethod
    def rsc_config(cls, encoded_payload):
        return validate(encoded_payload)

    def _init_info(self):
        res = self.net.dispatch("vpn/server/ip", "GET")
        self.config["ip"] = res.pop("ip", None)

    @classmethod
    def cert(cls, identity):
        return cls.instance.net.text.dispatch(f"mikrotik/devices/{identity}/config", "GET")
