import socket

from decouple import config


def get_host(request):
    host = request.get_host()
    # For production domains, don't add a port
    if '.com' in host or '.org' in host or '.net' in host or '.io' in host:
        return f"{request.scheme}://{host}"
    else:
        host = f"{config("PUBLIC_IP")}:8000"
    return f"{request.scheme}://{host}"

