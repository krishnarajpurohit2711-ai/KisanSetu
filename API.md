# API Reference

## Authentication

### POST /api/v1/auth/register
Creates a new user.

### POST /api/v1/auth/login
Returns JWT access and refresh tokens.

### GET /api/v1/auth/me
Returns current authenticated user data.

## Farmers and lots

### POST /api/v1/lots
Creates a crop lot.

### PUT /api/v1/lots/{id}/verify
Marks a lot as verified by admin.

## Market intelligence

### GET /api/v1/market/sale-window
Returns crop pricing recommendation and sale timing advice.

## Demands and matching

### GET /api/v1/demands/{id}/matches
Calculates ranked supply matches for a buyer demand.

## Negotiation and orders

### POST /api/v1/lots/{id}/offers
Creates a buyer offer.

### POST /api/v1/offers/{id}/accept
Accepts an offer.

### POST /api/v1/offers/{id}/counter
Counters an offer.

### POST /api/v1/orders/{id}/transition
Moves an order through the lifecycle.

## Error format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ORDER_TRANSITION",
    "message": "An order cannot move from DELIVERED to PICKUP_SCHEDULED."
  }
}
```
