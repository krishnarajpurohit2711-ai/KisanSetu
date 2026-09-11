from sqlalchemy import Column, Float, Integer, String

from app.db.database import Base


class Demand(Base):
    __tablename__ = 'demands'

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, nullable=False)
    crop = Column(String, nullable=False)
    target_quantity = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    required_grade = Column(String, nullable=False)
    required_date = Column(String, nullable=False)
