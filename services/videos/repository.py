from domain import Video

class Repository:
    def __init__(self):
        self.videos = {}
        
    def get_videos(self):
        return self.videos
    
    def add_video(self, video: Video):
        self.videos[video.id] = video
        
    def get_video(self, video_id: str):
        return self.videos.get(video_id)