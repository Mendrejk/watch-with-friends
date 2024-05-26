from typing import Union

from fastapi import FastAPI

from repository import Repository

import postgress_handler

app = FastAPI(root_path='/api/users')
repository = Repository()

postgress_handler.init_db()
postgress_handler.add_demo_data()


@app.get('/')
def read_root():
    return {'Hello': 'Users'}


@app.get('/items/{item_id}')
def read_item(item_id: int, q: Union[str, None] = None):
    return {'item_id': item_id, 'q': q}

@app.get("/testdb")
async def read_item():
    with postgress_handler.connect_to_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""SELECT * FROM TestTable""")
            return {'test': cur.fetchall()}
        
        # checking premium account
premium_accounts = ['premium']

@app.get("/check-premium/{user_name}")
async def check_premium(user_name: str):
    if user_name in premium_accounts:
        return {'premium': True}
    else:
        return {'premium': False}


# adding new premium account
# ta wiem z tym get pojechałem, ale sorry improwizuję
@app.get("/stripe-success/{user_name}")
async def add_premium(user_name: str):
    premium_accounts.append(user_name)
    return {'premium': True}