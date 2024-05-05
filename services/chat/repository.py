from domain import Room, Message
from typing import Dict

class Repository:
    def __init__(self):
        self.rooms: Dict[str, Room] = {}
        
    def get_rooms(self):
        return self.rooms
    
    def add_room(self, room: Room):
        self.rooms[room.id] = room
        
    def get_room(self, room_id: str):
        return self.rooms.get(room_id)

    def add_message(self, room_id: str, message: str, user_name: str):
        room = self.rooms.get(room_id)
        if room:
            room.messages.append(Message(user_name=user_name, message=message))
        else:
            raise Exception(f"Room {room_id} not found")
