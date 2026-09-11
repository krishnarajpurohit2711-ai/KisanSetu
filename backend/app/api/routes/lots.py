from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class LotCreate(BaseModel):
    crop: str
    variety: str
    grade: str
    quantity: int
    unit: str = 'kg'
    expected_price: float
    harvest_date: str
    availability_date: str


@router.post('/lots')
def create_lot(payload: LotCreate):
    return {
        'success': True,
        'message': 'Lot created successfully',
        'status': 'VERIFICATION_PENDING',
        'digital_quality_passport': {
            'crop': payload.crop,
            'variety': payload.variety,
            'grade': payload.grade,
            'quantity': payload.quantity,
            'unit': payload.unit,
            'expected_price': payload.expected_price,
            'harvest_date': payload.harvest_date,
            'availability_date': payload.availability_date,
        },
    }


@router.put('/lots/{lot_id}/verify')
def verify_lot(lot_id: int):
    return {'success': True, 'lot_id': lot_id, 'status': 'VERIFIED', 'badge': '✓ Verified Quality'}
