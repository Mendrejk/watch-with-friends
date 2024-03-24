from domain import User

class Repository:
    def __init__(self):
        self.users = {}
        
    def get_users(self):
        return self.users
    
    def add_user(self, user: User):
        self.users[user.id] = user
        
    def get_user(self, user_id: str):
        return self.users.get(user_id)