from sqlalchemy import Column, Float, Integer, String

from app.db.database import Base


class CropLot(Base):
    __tablename__ = 'crop_lots'

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, nullable=False)
    crop = Column(String, nullable=False)
    variety = Column(String, nullable=False)
    quantity_kg = Column(Float, nullable=False)
    grade = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    status = Column(String, default='VERIFICATION_PENDING')
    location_lat = Column(Float, nullable=True)
    location_lon = Column(Float, nullable=True)
