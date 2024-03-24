import asyncio
import dataclasses
import json
import uuid
from fastapi import FastAPI, WebSocket
import kafka_handler
import postgress_handler
from domain import Room, RoomStatus, Video
from repository import Repository
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(root_path='/api/rooms')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

repository = Repository()

postgress_handler.init_db()
postgress_handler.add_demo_data()


@app.post('/create_room/{room_name}/{owner_name}')
async def create_room(room_name: str, owner_name: str):
    room_id = str(uuid.uuid4())
    owner_id = str(uuid.uuid4())

    repository.add_room(
        Room(id=room_id, name=room_name, owner=(owner_id, owner_name), users=[], status=RoomStatus.NO_VIDEO,
             video=Video(url='', length=0, progress=0)))
    await kafka_handler.send_one('main_topic', ('room_created', room_id))
    return {'room': repository.get_room(room_id)}


@app.delete('/delete_room/{room_id}')
async def delete_room(room_id: str):
    repository.delete_room(room_id)
    await kafka_handler.send_one('main_topic', ('room_deleted', room_id))
    return {'room': room_id}


@app.get('/room/{room_id}')
async def read_room(room_id: str):
    return {'room': repository.get_room(room_id)}


@app.get('/room/{room_id}/owner')
async def read_room_owner(room_id: str):
    room = repository.get_room(room_id)
    return {'owner': room.owner}


@app.get('/room/{room_id}/users')
async def read_room_users(room_id: str):
    room = repository.get_room(room_id)
    return {'users': room.users}


# TODO: in the future we should probably use id from user service instead of generating one
@app.post('/room/{room_id}/join/{user_name}')
async def join_room(room_id: str, user_name: str):
    room = repository.get_room(room_id)
    user_id = str(uuid.uuid4())
    room.users.append((user_id, user_name))
    await kafka_handler.send_one('main_topic', ('user_joined', room_id, user_id))
    return {'user_id': user_id, 'room': room}


@app.delete('/room/{room_id}/leave/{user_id}')
async def leave_room(room_id: str, user_id: str):
    room = repository.get_room(room_id)
    room.users = [user for user in room.users if user[0] != user_id]
    await kafka_handler.send_one('main_topic', ('user_left', room_id, user_id))
    return {'room': room}


@app.post('/room/{room_id}/play')
async def play(room_id: str):
    room = repository.get_room(room_id)
    room.status = RoomStatus.PLAYING
    await kafka_handler.send_one('main_topic', ('video_played', room_id))
    return {'room': room}


@app.post('/room/{room_id}/pause')
async def pause(room_id: str):
    room = repository.get_room(room_id)
    room.status = RoomStatus.PAUSED
    await kafka_handler.send_one('main_topic', ('video_paused', room_id))
    return {'room': room}


@app.post('/room/{room_id}/set_video/{video_url}/{user_id}')
async def set_video(room_id: str, video_url: str, user_id: str):
    # TODO no video metadata is set
    room = repository.get_room(room_id)

    if room.owner[0] != user_id:
        return {'error': 'Only owner can set video'}

    room.video = Video(url=video_url, length=0, progress=0)

    await kafka_handler.send_one('main_topic', ('video_set', room_id, video_url))
    return {'room': room}


@app.get('/room/{room_id}/video')
async def read_video(room_id: str):
    room = repository.get_room(room_id)

    return {'video': room.video.url}


@app.get('/room/{room_id}/status')
async def read_status(room_id: str):
    room = repository.get_room(room_id)
    return {'status': room.status}


@app.post('/room/{room_id}/set_progress/{progress}')
async def set_progress(room_id: str, progress: int, user_id: str):
    room = repository.get_room(room_id)

    if room.owner[0] != user_id:
        return {'error': 'Only owner can set progress'}

    room.video.progress = progress

    await kafka_handler.send_one('main_topic', ('video_progress_set', room_id, progress))
    return {'room': room}


@app.get('/room/{room_id}/progress')
async def read_progress(room_id: str):
    room = repository.get_room(room_id)

    return {'progress': room.video.progress}


@app.get('/rooms')
async def read_rooms():
    return {"rooms": list(repository.rooms.values())}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        rooms = repository.get_rooms()
        # Extract statues from rooms
        rooms = {room_id: (room.video.progress, room.status.value)  for room_id, room in rooms.items()}
        await websocket.send_text(json.dumps(rooms))
        await asyncio.sleep(0.1)
    
