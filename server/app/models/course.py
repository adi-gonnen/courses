from sqlalchemy import Column, String, Integer
import uuid
from .base import BaseModel

class Course(BaseModel):
    __tablename__ = 'course'
    uuid = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    start_date = Column(String, nullable=False)
    days_count = Column(Integer, nullable=False)

class CourseExercise(BaseModel):
    __tablename__ = 'course_exercise'
    uuid = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_uuid = Column(String(36), nullable=False)
    exercise_uuid = Column(String(36), nullable=False)
    day_number = Column(Integer, nullable=False)
    order_in_day = Column(Integer, nullable=False)