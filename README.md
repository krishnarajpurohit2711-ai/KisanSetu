# KisanSetu Smart Market Linkage

This repository is a prototype microservice architecture for the KisanSetu platform, matching the DISCOVER → MATCH → SELL journey described for market intelligence, commerce, and AI-driven buyer matching.

## Repository layout

```text
smart-market-linkage/
├── frontend/           # React / Vite / Tailwind
├── backend/            # FastAPI / Core API
├── ai-service/         # Python / ML Models
├── data/               # Synthetic datasets (.csv)
├── docker-compose.yml
├── .env.example
├── README.md
├── ARCHITECTURE.md
├── API.md
├── ML.md
└── .gitignore
```

## Quick start

```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs
- AI Service: http://localhost:8001/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Demo flow

1. farmer@demo.com logs in and creates a Tomato lot
2. AI generates a sale-window recommendation
3. buyer@demo.com logs in and creates a demand
4. Matching engine ranks the lot above 90%
5. Buyer places an offer and farmer accepts
6. Order proceeds through the lifecycle to PAYMENT_COMPLETED

## Important notes

- `.env` is not committed and should be created from `.env.example`
- The prototype uses mock and synthetic data to support hackathon-style demos
- Use a real secret manager for production deployment
