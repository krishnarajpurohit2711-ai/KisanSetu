from fastapi import APIRouter

router = APIRouter()


@router.get('/demands/{demand_id}/matches')
def match_demand(demand_id: int):
    return {
        'demand_id': demand_id,
        'matches': [
            {
                'lot_id': 102,
                'farmer_name': 'Saraswati FPO',
                'matching_score': 94.2,
                'distance_km': 32.5,
                'price_score': 100,
                'verified': True,
            },
            {
                'lot_id': 103,
                'farmer_name': 'Kamal Farms',
                'matching_score': 91.7,
                'distance_km': 46.1,
                'price_score': 92,
                'verified': True,
            },
        ],
    }
