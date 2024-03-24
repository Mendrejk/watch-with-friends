from domain import Room
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