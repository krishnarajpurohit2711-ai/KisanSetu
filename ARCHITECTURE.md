# Architecture

## Microservice overview

```text
User browser
   |
   v
React frontend (Vite + Tailwind)
   |
   +--> REST API (FastAPI Backend)
            |
            +--> PostgreSQL (relational domain model)
            +--> Redis (caching / session / rate limiting)
            +--> AI Service (market intelligence / matching)

AI service:
   - loads historical_prices.csv
   - runs a baseline price prediction model
   - exposes sale-window recommendations
   - computes matching scores for crop lots vs buyer demands
```

## Scaling plan

### District
- local crop lots and buyers
- fast market intelligence near the source of data
- local FPO communication and buyer discovery

### State
- aggregated market data and route planning
- cross-district matching for large buyer groups
- consolidated notifications and logistics coordination

### National
- commodity-wide price benchmarking
- central dashboard for policy and operations oversight
- AI model training and cross-region trend analysis

## Recommended extension path

1. Add event-driven messaging with Kafka or RabbitMQ
2. Add analytics warehouse for historical market performance
3. Introduce image/quality verification workflows for grading
4. Add SCADA or cold-chain telemetry integrations
5. Adopt managed Postgres, Redis, and deployment autoscaling on Kubernetes
