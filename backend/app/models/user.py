from sqlalchemy import Boolean, Column, Enum, Integer, String

from app.db.database import Base


class UserRole(str):
    pass


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default='FARMER')
    is_verified = Column(Boolean, default=False)
