import csv
from pathlib import Path

from fastapi import FastAPI

app = FastAPI(title='KisanSetu AI Service', version='0.1.0')


def load_historical_prices():
    csv_path = Path(__file__).resolve().parents[1] / 'data' / 'historical_prices.csv'
    rows = []
    try:
        with csv_path.open(newline='') as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                rows.append({
                    'date': row['date'],
                    'crop': row['crop'],
                    'market': row['market'],
                    'price': float(row['price']),
                })
    except FileNotFoundError:
        rows = [
            {'date': '2026-08-01', 'crop': 'Tomato', 'market': 'Nashik', 'price': 24},
            {'date': '2026-08-03', 'crop': 'Tomato', 'market': 'Nashik', 'price': 26},
            {'date': '2026-08-05', 'crop': 'Tomato', 'market': 'Nashik', 'price': 25},
            {'date': '2026-08-07', 'crop': 'Tomato', 'market': 'Nashik', 'price': 28},
            {'date': '2026-08-09', 'crop': 'Tomato', 'market': 'Nashik', 'price': 30},
            {'date': '2026-08-11', 'crop': 'Tomato', 'market': 'Nashik', 'price': 29},
            {'date': '2026-08-13', 'crop': 'Tomato', 'market': 'Nashik', 'price': 31},
        ]
    return rows


@app.get('/health')
def health_check():
    return {'status': 'ok', 'service': 'ai-service'}


@app.get('/api/v1/market/sale-window')
def sale_window():
    rows = load_historical_prices()
    current = float(rows[-1]['price'])
    predicted = current * 1.1
    recommended_low = round(predicted * 0.94, 2)
    recommended_high = round(predicted * 1.03, 2)
    return {
        'crop': 'Tomato',
        'current_price': round(current, 2),
        'predicted_7_day_price': round(predicted, 2),
        'recommended_range': [recommended_low, recommended_high],
        'suggested_action': 'Wait 2-3 days',
        'confidence_score': 72.4,
    }


@app.get('/api/v1/demands/{demand_id}/matches')
def matches(demand_id: int):
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
