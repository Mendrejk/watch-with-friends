from domain import User
from postgress_handler import connect_to_db
import uuid

class Repository:
    def __init__(self):
        self.users = {}
        
    def get_users(self):
        return self.users
    
    # def add_user(self, user: User):
    #     self.users[user.id] = user
        
    # def get_user(self, user_id: str):
    #     return self.users.get(user_id)
    
    def get_user_by_name(self, username: str):
        with connect_to_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, name, hashed_password FROM users WHERE name = %s", (username,))
                row = cur.fetchone()
                if row:
                    return User(id=row[0], name=row[1], hashed_password=row[2])
                return None


    def add_user(self, user: User):
        with connect_to_db() as conn:
            with conn.cursor() as cur:
                cur.execute("INSERT INTO users (id, name, hashed_password) VALUES (%s, %s, %s)",
                            (user.id, user.name, user.hashed_password))

    def get_user(self, user_id: str):
        with connect_to_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, name FROM users WHERE id = %s", (user_id,))
                row = cur.fetchone()
                if row:
                    return User(id=row[0], name=row[1], hashed_password=row[2])
                return None