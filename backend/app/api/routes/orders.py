from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class TransitionRequest(BaseModel):
    from_state: str
    to_state: str


VALID_TRANSITIONS = {
    'OFFER_ACCEPTED': {'ORDER_CONFIRMED'},
    'ORDER_CONFIRMED': {'PICKUP_SCHEDULED'},
    'PICKUP_SCHEDULED': {'IN_TRANSIT'},
    'IN_TRANSIT': {'DELIVERED'},
    'DELIVERED': {'PAYMENT_COMPLETED'},
    'PAYMENT_COMPLETED': set(),
    'CANCELLED': set(),
}

TRACKING_ROUTE = [
    {'name': 'Nashik farm gate', 'percent': 15, 'label': 'Nashik', 'lat': 20.0059, 'lng': 73.7898},
    {'name': 'Sinnar checkpoint', 'percent': 32, 'label': 'Sinnar', 'lat': 19.8456, 'lng': 73.9988},
    {'name': 'Sangamner hub', 'percent': 48, 'label': 'Sangamner', 'lat': 19.5679, 'lng': 74.2115},
    {'name': 'Akluj hub', 'percent': 70, 'label': 'Akluj', 'lat': 17.8827, 'lng': 74.3724},
    {'name': 'Pune corridor', 'percent': 100, 'label': 'Pune', 'lat': 18.5204, 'lng': 73.8567},
]


@router.get('/orders/{order_id}/tracking')
def get_order_tracking(order_id: int):
    history = [
        {**point, 'timestamp': f'2026-09-11T{hour}:00:00+05:30', 'status': 'PREVIOUS'}
        for point, hour in zip(TRACKING_ROUTE[:-1], ('08:15', '09:05', '10:00', '11:25'))
    ]
    live_point = {**TRACKING_ROUTE[-1], 'timestamp': '2026-09-11T12:10:00+05:30', 'status': 'LIVE'}
    return {
        'success': True,
        'order_id': order_id,
        'status': 'IN_TRANSIT',
        'vehicle': 'Truck MH 20 AB 4812',
        'speed_kmh': 28,
        'eta_minutes': 140,
        'current_stop': 'Pune corridor',
        'item_name': 'Onion',
        'farmer_name': 'Saraswati FPO',
        'route': TRACKING_ROUTE,
        'active_index': 4,
        'current_location': live_point,
        'tracking_history': history + [live_point],
    }


@router.post('/lots/{lot_id}/offers')
def create_offer(lot_id: int):
    return {'success': True, 'lot_id': lot_id, 'offer_id': 88, 'status': 'CREATED'}


@router.post('/offers/{offer_id}/accept')
def accept_offer(offer_id: int):
    return {'success': True, 'offer_id': offer_id, 'status': 'ACCEPTED'}


@router.post('/offers/{offer_id}/counter')
def counter_offer(offer_id: int):
    return {'success': True, 'offer_id': offer_id, 'status': 'COUNTERED'}


@router.post('/orders/{order_id}/transition')
def transition_order(order_id: int, payload: TransitionRequest):
    allowed = VALID_TRANSITIONS.get(payload.from_state, set())
    if payload.to_state not in allowed:
        if payload.from_state == 'DELIVERED' and payload.to_state == 'PICKUP_SCHEDULED':
            detail = {
                'success': False,
                'error': {
                    'code': 'INVALID_ORDER_TRANSITION',
                    'message': 'An order cannot move from DELIVERED to PICKUP_SCHEDULED.',
                },
            }
        else:
            detail = {
                'success': False,
                'error': {
                    'code': 'INVALID_ORDER_TRANSITION',
                    'message': f'An order cannot move from {payload.from_state} to {payload.to_state}.',
                },
            }
        raise HTTPException(status_code=400, detail=detail)
    return {'success': True, 'order_id': order_id, 'from_state': payload.from_state, 'to_state': payload.to_state}
