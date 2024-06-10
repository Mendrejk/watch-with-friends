from dataclasses import dataclass

@dataclass
class User:
    id: str
    name: str
    hashed_password: str
