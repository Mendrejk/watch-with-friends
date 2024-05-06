import asyncio
from dataclasses import dataclass
from typing import Union

from pydantic import BaseModel
import kafka_handler
from fastapi import FastAPI
from repository import Repository
from domain import Video
from pytube import YouTube
import postgress_handler

app = FastAPI(root_path='/api/videos')
repository = Repository()

postgress_handler.init_db()
postgress_handler.add_demo_data()

@dataclass
class VideoData:
    url: str
    title: str
    duration: int

async def parse_video_url(url: str):
    if("youtube.com" in url):
        yt = YouTube(url)
        return VideoData(url=url, title=yt.title, duration=yt.length)
    return None

async def consume_handler(msg):
    match msg:
        case ('video_url_parse_request', x):
            data = await parse_video_url(x)
            await kafka_handler.send_one('main_topic', ('video_url_parsed', data))

asyncio.create_task(kafka_handler.consume('main_topic', consume_handler))

@app.get('/')
def read_root():
    return {'Hello': 'Videos 3'}

class ParseRequest(BaseModel):
    url: str
    
@app.post('/parse')
async def read_item(request: ParseRequest):
    return await parse_video_url(request.url)

@app.get("/testdb")
async def read_item():
    with postgress_handler.connect_to_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""SELECT * FROM TestTable""")
            return {'test': cur.fetchall()}