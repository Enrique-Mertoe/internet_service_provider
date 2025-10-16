import dataclasses
from typing import TypeVar, Generic, Union

T = TypeVar('T')


@dataclasses.dataclass
class MtkResponseObject(Generic[T]):
    error: str | None = None
    status: str | None = None
    message: str | None = None
    secret: str = None
    success: bool = None


@dataclasses.dataclass
class MtkResponseObject(MtkResponseObject[Union[T, None]]):
    payload: T | None = None


@dataclasses.dataclass
class MtkPayload:
    certificate_created: bool
    client_name: str
    config_file_available: bool
    created_at: str
