# Machine Learning Design

## Forecasting model

The AI service uses a baseline time-series prediction model to estimate future price movement for a crop in a given market. The prototype can use either a Prophet model or a lightweight statistical baseline when dependencies are constrained.

### Inputs
- crop
- market
- historical prices over time
- market arrival volume
- demand trend

### Outputs
- current_price
- predicted_7_day_price
- recommended_range
- suggested_action
- confidence_score

## Matching formula

The match score is a weighted blend of normalized factors:

- Quantity compatibility: 30%
- Price compatibility: 25%
- Geographic proximity: 20%
- Quality compatibility: 15%
- Delivery-date compatibility: 10%

```text
matching_score = 0.30 * quantity_score + 0.25 * price_score + 0.20 * proximity_score + 0.15 * quality_score + 0.10 * delivery_score
```

This ensures buyers see transparent reasons behind the ranking and keeps the model explainable for field operators and farmers.
