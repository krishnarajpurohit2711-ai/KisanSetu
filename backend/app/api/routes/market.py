from fastapi import APIRouter

router = APIRouter()


@router.get('/market/sale-window')
def sale_window():
    return {
        'crop': 'Tomato',
        'market': 'Pune APMC',
        'price_unit': '₹/kg',
        'current_price': 28,
        'predicted_7_day_price': 31,
        'recommended_range': [29, 32],
        'suggested_action': 'Wait 2-3 days',
        'confidence_score': 72.4,
    }
