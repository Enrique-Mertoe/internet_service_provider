import random
import string


def generate_key(length=16):
    chars = string.ascii_letters + string.digits  # a-zA-Z0-9
    return ''.join(random.choices(chars, k=length))

def get_mode_from_url(url):
    if url.startswith('https://'):
        return 'https'
    else:
        return 'http'
