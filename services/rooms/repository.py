from typing import Dict
import uuid
import random
from domain import Room, RoomStatus, User, Video


class Repository:
    rooms: Dict[str, Room]
    
    def __init__(self):
        self.rooms = {}
        animal_homes = [('Bear', 'Den'), ('Devin', 'Mancave'), ('Bird', 'Nest'), ('Dog', 'Kennel'), ('Horse', 'Stable'), ('Spider', 'Web')]
        animal_names = ['Lion', 'Tiger', 'Elephant', 'Giraffe', 'Monkey', 'Zebra']
        devin: User = ("1337", "Devin")  # Hardcoded user Devin
        for i, (animal, home) in enumerate(animal_homes):
            room_id = str(uuid.uuid4())
            owner_id = str(uuid.uuid4())
            owner: User = (owner_id, animal)
            if i == 1:  # Set the owner of the second room to Devin
                owner = devin
            room = Room(id=room_id, name=f'{animal}\'s {home}', owner=owner, users=[], status=RoomStatus.NO_VIDEO, video=Video(url='', length=0, progress=0))
            if i != 0:  # Skip the first room to have at least one room with no users
                selected_animals = random.sample(animal_names, random.randint(1, len(animal_names)))  # Randomly select a subset of animal names
                for animal_name in selected_animals:
                    user_id = str(uuid.uuid4())
                    user: User = (user_id, animal_name)
                    room.users.append(user)
            self.rooms[room_id] = room

    def get_rooms(self):
        return self.rooms

    def add_room(self, room: Room):
        self.rooms[room.id] = room

    def get_room(self, room_id: str):
        return self.rooms.get(room_id)

    def delete_room(self, room_id):
        del self.rooms[room_id]