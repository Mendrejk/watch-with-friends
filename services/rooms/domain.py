from dataclasses import dataclass
from enum import Enum
from typing import List, Tuple

type UserId = str
type UserName = str
type User = Tuple[UserId, UserName]


class RoomStatus(Enum):
    PLAYING = 'PLAYING'
    PAUSED = 'PAUSED'
    NO_VIDEO = 'NO_VIDEO'


@dataclass
class Video:
    url: str
    length: int
    progress: int


@dataclass
class Room:
    id: str
    name: str
    owner: User
    users: List[User]
    status: RoomStatus
    video: Video
