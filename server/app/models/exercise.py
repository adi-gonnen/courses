from sqlalchemy import Column, String, JSON
# from datetime import datetime
import uuid
from .base import BaseModel

class Exercise(BaseModel):
    __tablename__ = 'exercise'
    uuid = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    instructions = Column(JSON, nullable=False)
    video_url = Column(String(255))

# class ExerciseChangeLog(BaseModel):
#     __tablename__ = 'exercise_change_log'
#     uuid = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
#     change_date = Column(String, default=lambda: datetime.utcnow().isoformat())
#     exercise_uuid = Column(String(36))
#     original = Column(JSON)
#     changes = Column(JSON)
