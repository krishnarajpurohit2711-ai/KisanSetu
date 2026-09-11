from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_access_token(subject: str, expires_minutes: int = 60) -> str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    payload = {'sub': subject, 'exp': expires}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')


def decode_access_token(token: str) -> str:
    payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
    return payload['sub']
