import os
from pydantic import BaseModel

class Settings(BaseModel):
    DATABASE_URL: str = os.getenv('DATABASE_URL', 'postgresql://user:pass@db:5432/kisansetu')
    JWT_SECRET: str = os.getenv('JWT_SECRET', 'demo_secret')
    AI_SERVICE_URL: str = os.getenv('AI_SERVICE_URL', 'http://ai-service:8001')
    TWILIO_ACCOUNT_SID: str = os.getenv('TWILIO_ACCOUNT_SID', '')
    TWILIO_AUTH_TOKEN: str = os.getenv('TWILIO_AUTH_TOKEN', '')
    TWILIO_VERIFY_SERVICE_SID: str = os.getenv('TWILIO_VERIFY_SERVICE_SID', '')
    TWILIO_MESSAGING_SERVICE_SID: str = os.getenv('TWILIO_MESSAGING_SERVICE_SID', '')
    TWILIO_PHONE_NUMBER: str = os.getenv('TWILIO_PHONE_NUMBER', '')
    TWILIO_WHATSAPP_NUMBER: str = os.getenv('TWILIO_WHATSAPP_NUMBER', '')
    TWILIO_VOICE_FROM: str = os.getenv('TWILIO_VOICE_FROM', '')
    PUBLIC_API_BASE_URL: str = os.getenv('PUBLIC_API_BASE_URL', '')
    EXOTEL_API_KEY: str = os.getenv('EXOTEL_API_KEY', '')
    EXOTEL_API_TOKEN: str = os.getenv('EXOTEL_API_TOKEN', '')
    EXOTEL_ACCOUNT_SID: str = os.getenv('EXOTEL_ACCOUNT_SID', '')
    EXOTEL_USSD_APP_ID: str = os.getenv('EXOTEL_USSD_APP_ID', '')

settings = Settings()
