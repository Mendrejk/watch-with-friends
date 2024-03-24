from typing import Union

from fastapi import FastAPI
from repository import Repository
from domain import Video

import postgress_handler

app = FastAPI(root_path='/api/videos')
repository = Repository()

postgress_handler.init_db()
postgress_handler.add_demo_data()

@app.get('/')
def read_root():
    return {'Hello': 'Videos 3'}

@app.get('/items/{item_id}')
def read_item(item_id: int, q: Union[str, None] = None):
    return {'item_id': item_id, 'q': q}

@app.get("/testdb")
async def read_item():
    with postgress_handler.connect_to_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""SELECT * FROM TestTable""")
            return {'test': cur.fetchall()}