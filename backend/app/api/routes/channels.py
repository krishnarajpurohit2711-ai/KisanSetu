from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import PlainTextResponse, Response
from pydantic import BaseModel
import httpx

from app.core.config import settings

router = APIRouter()


class ChannelMessage(BaseModel):
    channel: str
    to: str
    message: str


def twilio_ready() -> bool:
    return bool(settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN)


def twilio_post(url: str, data: dict[str, str]) -> dict:
    if not twilio_ready():
        raise HTTPException(status_code=503, detail='Twilio channel integration is not configured')
    try:
        response = httpx.post(url, data=data, auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN), timeout=10)
    except httpx.RequestError as error:
        raise HTTPException(status_code=502, detail='Unable to reach Twilio') from error
    if response.is_error:
        raise HTTPException(status_code=502, detail='Twilio rejected the channel request')
    return response.json()


@router.post('/message')
def send_message(payload: ChannelMessage):
    channel = payload.channel.lower()
    if channel not in {'sms', 'whatsapp'}:
        raise HTTPException(status_code=400, detail='Use the voice or USSD endpoints for those channels')
    sender = settings.TWILIO_PHONE_NUMBER if channel == 'sms' else settings.TWILIO_WHATSAPP_NUMBER
    if not sender:
        raise HTTPException(status_code=503, detail=f'Twilio {channel} sender is not configured')
    to = payload.to if channel == 'sms' else f'whatsapp:{payload.to}'
    from_value = sender if channel == 'sms' else f'whatsapp:{sender}'
    result = twilio_post(
        f'https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json',
        {'To': to, 'From': from_value, 'Body': payload.message},
    )
    return {'success': True, 'channel': channel, 'message_id': result.get('sid')}


@router.post('/voice/call')
def start_voice_call(to: str):
    if not settings.TWILIO_VOICE_FROM or not settings.PUBLIC_API_BASE_URL:
        raise HTTPException(status_code=503, detail='Twilio voice integration is not configured')
    result = twilio_post(
        f'https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Calls.json',
        {'To': to, 'From': settings.TWILIO_VOICE_FROM, 'Url': f'{settings.PUBLIC_API_BASE_URL}/api/v1/channels/voice/twiml'},
    )
    return {'success': True, 'call_id': result.get('sid')}


@router.post('/voice/twiml')
def voice_twiml():
    return Response(
        content='<?xml version="1.0" encoding="UTF-8"?><Response><Gather input="speech dtmf" numDigits="1" action="/api/v1/channels/voice/menu" method="POST"><Say language="en-IN">Welcome to KisanSetu. Press 1 for market prices. Press 2 for active offers.</Say></Gather></Response>',
        media_type='application/xml',
    )


@router.post('/voice/menu')
async def voice_menu(request: Request):
    form = await request.form()
    digit = form.get('Digits', '')
    text = 'Today onion is 3020 rupees per quintal.' if digit == '1' else 'You have 8 pending offers.'
    return Response(content=f'<?xml version="1.0" encoding="UTF-8"?><Response><Say language="en-IN">{text}</Say></Response>', media_type='application/xml')


@router.post('/exotel/ussd', response_class=PlainTextResponse)
async def exotel_ussd(request: Request):
    form = await request.form()
    user_input = str(form.get('text', ''))
    if not user_input:
        return 'CON KisanSetu\n1. Market price\n2. My offers'
    return 'END Onion market price is Rs 3020 per quintal.' if user_input.endswith('1') else 'END You have 8 pending offers.'
