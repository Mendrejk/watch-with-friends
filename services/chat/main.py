import asyncio
import json
from typing import Dict, List
from fastapi import FastAPI, WebSocket
import kafka_handler
import postgress_handler
from dataclasses import dataclass
from repository import Repository
from domain import Room
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(root_path="/api/chat")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

postgress_handler.init_db()
postgress_handler.add_demo_data()

repository = Repository()


async def consume_handler(msg):
    match msg:
        case ('room_created', x):
            repository.add_room(Room(id=x, messages=[]))


asyncio.create_task(kafka_handler.consume('main_topic', consume_handler))


@app.get("/")
async def read_root():
    return {'Hello': 'Chat'}


@app.get("/rooms")
async def read_rooms():
    return {"rooms": repository.get_rooms()}


@app.get('/room/{room_id}')
async def read_room(room_id: str):
    return {'room': repository.get_room(room_id)}


@app.post('/create_room/{room_id}')
async def create_room(room_id: str):
    repository.add_room(Room(id=room_id, messages=[]))
    await kafka_handler.send_one('main_topic', ('chat_room_created', room_id))
    return {'room': repository.get_room(room_id)}


@app.post('/room/{room_id}/add_message/{message}/{user_name}')
async def add_message(room_id: str, message: str, user_name: str):
    repository.add_message(room_id, message, user_name)
    await kafka_handler.send_one('main_topic', ('message_added', room_id, message, user_name))
    return {'room': repository.get_room(room_id)}

@app.get("/testdb")
async def read_item():
    with postgress_handler.connect_to_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""SELECT * FROM TestTable""")
            return {'test': cur.fetchall()}


@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()
    while True:
        room = repository.get_room(room_id)
        if room:
            messages = {x: (room.messages[x].user_name, room.messages[x].message) for x in range(len(room.messages))}
            await websocket.send_text(json.dumps(messages))
        await asyncio.sleep(0.1)
