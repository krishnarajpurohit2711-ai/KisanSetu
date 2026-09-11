from datetime import datetime, timezone

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.database import Base, engine, get_db
from app.models.chat import ChatMessage

router = APIRouter()
connections: dict[int, set[WebSocket]] = {}


class MessageRequest(BaseModel):
    sender_id: int = 1
    sender_name: str = Field(min_length=1, max_length=120)
    sender_role: str = Field(pattern='^(FARMER|BUYER)$')
    message: str = Field(min_length=1, max_length=2000)


def serialize_message(message: ChatMessage) -> dict:
    return {
        'id': message.id,
        'order_id': message.order_id,
        'sender_id': message.sender_id,
        'sender_name': message.sender_name,
        'sender_role': message.sender_role,
        'message': message.message,
        'created_at': (message.created_at or datetime.now(timezone.utc)).isoformat(),
    }


async def broadcast(order_id: int, payload: dict) -> None:
    stale = []
    for websocket in connections.get(order_id, set()):
        try:
            await websocket.send_json(payload)
        except Exception:
            stale.append(websocket)
    for websocket in stale:
        connections[order_id].discard(websocket)


@router.get('/orders/{order_id}/chat')
def list_messages(order_id: int, db: Session = Depends(get_db)):
    Base.metadata.create_all(bind=engine)
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.order_id == order_id)
        .order_by(ChatMessage.created_at.asc(), ChatMessage.id.asc())
        .all()
    )
    return {'success': True, 'messages': [serialize_message(message) for message in messages]}


@router.post('/orders/{order_id}/chat')
async def create_message(order_id: int, payload: MessageRequest, db: Session = Depends(get_db)):
    Base.metadata.create_all(bind=engine)
    message = ChatMessage(order_id=order_id, **payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    response = serialize_message(message)
    await broadcast(order_id, response)
    return {'success': True, 'message': response}


@router.websocket('/orders/{order_id}/chat/ws')
async def chat_socket(websocket: WebSocket, order_id: int):
    await websocket.accept()
    connections.setdefault(order_id, set()).add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connections.get(order_id, set()).discard(websocket)
