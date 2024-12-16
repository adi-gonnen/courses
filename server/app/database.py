from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import json
from app.models.base import Base
from app.models.course import Course, CourseExercise
from app.models.exercise import Exercise

engine = create_engine('sqlite:///exercises.db')
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(engine)
    db = get_db()
    
    
    if not db.query(Exercise).first():
        with open('seed_data/exercises.json') as f:
            exercises = json.load(f)
            for item in exercises:
                exercise = Exercise(**item)
                db.add(exercise)
        db.commit()
        
        all_exercises = db.query(Exercise).limit(9).all()
        
        
        default_course = Course(
            title="Beginner's Workout Plan",
            start_date=datetime.now(timezone.utc).strftime('%Y-%m-%d'),
            days_count=3
        )
        db.add(default_course)
        db.commit()
        
        
        for day in range(3):
            for order in range(3):
                exercise_index = day * 3 + order
                course_exercise = CourseExercise(
                    course_uuid=default_course.uuid,
                    exercise_uuid=all_exercises[exercise_index].uuid,
                    day_number=day + 1,
                    order_in_day=order + 1
                )
                db.add(course_exercise)
        
        db.commit()        
    