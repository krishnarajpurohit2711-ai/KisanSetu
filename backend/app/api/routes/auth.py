from fastapi import APIRouter, Depends, HTTPException, Header
import httpx
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.security import create_access_token, decode_access_token
from app.db.database import get_db
from app.core.config import settings

router = APIRouter()

DEMO_USERS = {
    'farmer@demo.com': 'FARMER',
    'buyer@demo.com': 'BUYER',
    'rajesh@demo.com': 'BUYER',
    'meera@demo.com': 'BUYER',
    'admin@demo.com': 'ADMIN',
}

REGISTERED_USERS: dict[str, dict[str, str]] = {}


class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str = 'FARMER'
    name: str | None = None
    mobile: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


class OtpRequest(BaseModel):
    mobile: str


class OtpVerifyRequest(BaseModel):
    mobile: str
    code: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = 'bearer'


def normalize_email(email: str) -> str:
    return email.strip().lower()


def normalize_mobile(mobile: str) -> str:
    digits = ''.join(ch for ch in mobile if ch.isdigit())
    return f'+91{digits[-10:]}' if len(digits) == 10 else mobile.strip()


def twilio_configured() -> bool:
    return all((settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, settings.TWILIO_VERIFY_SERVICE_SID))


def twilio_request(path: str, data: dict[str, str]) -> dict:
    if not twilio_configured():
        raise HTTPException(status_code=503, detail='SMS OTP provider is not configured')
    url = f'https://verify.twilio.com/v2/Services/{settings.TWILIO_VERIFY_SERVICE_SID}/{path}'
    try:
        response = httpx.post(
            url,
            data=data,
            auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN),
            timeout=10,
        )
    except httpx.RequestError as error:
        raise HTTPException(status_code=502, detail='Unable to reach SMS OTP provider') from error
    if response.is_error:
        raise HTTPException(status_code=502, detail='SMS OTP provider rejected the request')
    return response.json()


def get_role_for_email(email: str) -> str:
    key = normalize_email(email)
    if key in DEMO_USERS:
        return DEMO_USERS[key]
    if key in REGISTERED_USERS:
        return REGISTERED_USERS[key]['role']
    return 'FARMER'


@router.post('/register')
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    email = normalize_email(payload.email)
    role = (payload.role or 'FARMER').upper()
    if role not in {'FARMER', 'BUYER', 'ADMIN'}:
        role = 'FARMER'
    REGISTERED_USERS[email] = {
        'password': payload.password,
        'role': role,
        'name': payload.name or email.split('@')[0],
        'mobile': normalize_mobile(payload.mobile) if payload.mobile else '',
    }
    return {'success': True, 'message': 'User registered', 'email': email, 'role': role}


@router.post('/otp/request')
def request_otp(payload: OtpRequest):
    result = twilio_request('Verifications', {'To': normalize_mobile(payload.mobile), 'Channel': 'sms'})
    return {'success': True, 'status': result.get('status', 'pending')}


@router.post('/otp/verify')
def verify_otp(payload: OtpVerifyRequest):
    result = twilio_request('VerificationCheck', {'To': normalize_mobile(payload.mobile), 'Code': payload.code})
    if result.get('status') != 'approved':
        raise HTTPException(status_code=401, detail='Invalid or expired OTP')
    return {'success': True, 'status': 'approved'}


@router.post('/otp/login')
def otp_login(payload: OtpVerifyRequest):
    verify_otp(payload)
    mobile = normalize_mobile(payload.mobile)
    demo_mobile_accounts = {
        'farmer@demo.com': '9876543210',
        'buyer@demo.com': '9876543211',
        'rajesh@demo.com': '9876543213',
        'meera@demo.com': '9876543214',
        'admin@demo.com': '9876543212',
    }
    email = next(
        (
            key for key, account_mobile in demo_mobile_accounts.items()
            if normalize_mobile(account_mobile) == mobile
        ),
        next(
            (
                key for key, account in REGISTERED_USERS.items()
                if account.get('mobile') == mobile
            ),
            None,
        ),
    )
    if not email:
        raise HTTPException(status_code=404, detail='No account is registered for this phone number')
    token = create_access_token(email)
    return {'access_token': token, 'refresh_token': token}


@router.post('/login', response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = normalize_email(payload.email)

    if email in DEMO_USERS and payload.password == 'demo123':
        token = create_access_token(email)
        return {'access_token': token, 'refresh_token': token}

    registered = REGISTERED_USERS.get(email)
    if registered and registered['password'] == payload.password:
        token = create_access_token(email)
        return {'access_token': token, 'refresh_token': token}

    raise HTTPException(status_code=401, detail='Invalid credentials')


@router.get('/me')
def me(authorization: str | None = Header(default=None, alias='Authorization')):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='Missing or invalid bearer token')

    token = authorization.split(' ', 1)[1].strip()
    email = decode_access_token(token)
    registered = REGISTERED_USERS.get(normalize_email(email or ''))
    return {
        'id': 1,
        'email': email,
        'role': get_role_for_email(email or ''),
        'name': registered['name'] if registered else (email or '').split('@')[0],
        'is_verified': True,
        'mobile': registered.get('mobile', '') if registered else '',
    }
