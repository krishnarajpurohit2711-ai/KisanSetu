from sqlalchemy import Column, Integer, String

from app.db.database import Base


class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True, index=True)
    lot_id = Column(Integer, nullable=False)
    buyer_id = Column(Integer, nullable=False)
    state = Column(String, default='OFFER_ACCEPTED')
