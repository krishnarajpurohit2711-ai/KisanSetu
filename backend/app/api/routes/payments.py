from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class DisputeRequest(BaseModel):
    order_id: str
    reason: str
    description: str


@router.get('/payments/{order_id}')
def payment_status(order_id: str):
    return {
        'success': True,
        'order_id': order_id,
        'status': 'ESCROW_PENDING',
        'amount': 3020,
        'currency': 'INR',
        'last_updated': '2026-09-11T10:30:00+05:30',
    }


@router.post('/disputes')
def create_dispute(payload: DisputeRequest):
    return {
        'success': True,
        'dispute_id': f'DSP-{payload.order_id}',
        'order_id': payload.order_id,
        'status': 'OPEN',
        'reason': payload.reason,
    }
