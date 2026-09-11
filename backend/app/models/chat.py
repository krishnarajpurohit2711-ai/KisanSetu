from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func

from app.db.database import Base


class ChatMessage(Base):
    __tablename__ = 'chat_messages'

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, nullable=False, index=True)
    sender_id = Column(Integer, nullable=False, index=True)
    sender_name = Column(String(120), nullable=False)
    sender_role = Column(String(20), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
