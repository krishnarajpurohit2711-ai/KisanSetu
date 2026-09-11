from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, chat, lots, market, demands, orders, channels, payments

app = FastAPI(title='KisanSetu API', version='0.1.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router, prefix='/api/v1/auth', tags=['auth'])
app.include_router(lots.router, prefix='/api/v1', tags=['lots'])
app.include_router(market.router, prefix='/api/v1', tags=['market'])
app.include_router(demands.router, prefix='/api/v1', tags=['demands'])
app.include_router(orders.router, prefix='/api/v1', tags=['orders'])
app.include_router(chat.router, prefix='/api/v1', tags=['chat'])
app.include_router(channels.router, prefix='/api/v1/channels', tags=['channels'])
app.include_router(payments.router, prefix='/api/v1', tags=['payments'])

@app.get('/health')
def health_check():
    return {'status': 'ok', 'service': 'backend'}
