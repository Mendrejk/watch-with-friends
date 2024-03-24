from dataclasses import dataclass
from typing import List

@dataclass
class Room:
    id: str
    messages: List[str]