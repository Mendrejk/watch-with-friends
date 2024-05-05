from dataclasses import dataclass
from typing import List


@dataclass
class Message:
    user_name: str
    message: str


@dataclass
class Room:
    id: str
    messages: List[Message]