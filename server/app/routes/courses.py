from flask import Blueprint, jsonify, request
from app.models.course import Course, CourseExercise
from app.models.exercise import Exercise
from app.database import get_db

course_bp = Blueprint('courses', __name__)

@course_bp.route('/', methods=['GET'])
def get_courses():
    """
    Get all courses
    ---
    responses:
      200:
        description: List of all courses
        schema:
          type: array
          items:
            type: object
            properties:
              uuid:
                type: string
                description: Course unique identifier
              title:
                type: string
                description: Course title
              start_date:
                type: string
                description: Course start date in YYYY-MM-DD format
              days_count:
                type: integer
                description: Number of days in course
    """    
    db = get_db()
    courses = db.query(Course).all()
    return jsonify([c.to_dict() for c in courses])

@course_bp.route('/<uuid>', methods=['GET'])
def get_course(uuid):
    """
    Get course details with exercises
    ---
    parameters:
      - name: uuid
        in: path
        type: string
        required: true
        description: UUID of course
    responses:
      200:
        description: Course details with exercises organized by days
        schema:
          type: object
          properties:
            uuid:
              type: string
              description: Course UUID
            title:
              type: string
              description: Course title
            start_date:
              type: string
              description: Course start date
            days_count:
              type: integer
              description: Number of days
            days:
              type: object
              description: Exercises organized by day number
              additionalProperties:
                type: array
                items:
                  type: object
                  properties:
                    uuid:
                      type: string
                    title:
                      type: string
                    instructions:
                      type: array
                      items:
                        type: string
                    video_url:
                      type: string
                    order_in_day:
                      type: integer
      404:
        description: Course not found
    """    
    db = get_db()
    course = db.query(Course).filter_by(uuid=uuid).first()
    if not course:
        return jsonify({"error": "Course not found"}), 404
    
    exercises = db.query(
        Exercise, CourseExercise
    ).join(
        CourseExercise, Exercise.uuid == CourseExercise.exercise_uuid
    ).filter(
        CourseExercise.course_uuid == uuid
    ).all()
    
    days = {}
    for exercise, course_exercise in exercises:
        day_num = course_exercise.day_number
        if day_num not in days:
            days[day_num] = []
        days[day_num].append({
            **exercise.to_dict(),
            'order_in_day': course_exercise.order_in_day
        })
        days[day_num].sort(key=lambda x: x['order_in_day'])
    
    return jsonify({
        **course.to_dict(),
        'days': days
    })

# @course_bp.route('/', methods=['POST'])
# def create_course():
#     """
#     Create a new course
#     ---
#     parameters:
#       - name: body
#         in: body
#         required: true
#         schema:
#           type: object
#           properties:
#             title:
#               type: string
#               description: Course title
#               required: true
#             start_date:
#               type: string
#               description: Course start date in YYYY-MM-DD format
#               required: true
#             days_count:
#               type: integer
#               description: Number of days in course
#               required: true
#     responses:
#       200:
#         description: Created course
#         schema:
#           type: object
#           properties:
#             uuid:
#               type: string
#             title:
#               type: string
#             start_date:
#               type: string
#             days_count:
#               type: integer
#     """    
#     db = get_db()
#     data = request.json
#     course = Course(
#         title=data['title'],
#         start_date=data['start_date'],
#         days_count=data['days_count']
#     )
#     db.session.add(course)
#     db.session.commit()
#     return jsonify(course.to_dict())

@course_bp.route('/<course_uuid>/exercises', methods=['PUT'])
def update_course_exercises(course_uuid):
    """
    Update or insert exercise in a course
    ---
    parameters:
      - name: course_uuid
        in: path
        type: string
        required: true
        description: UUID of the course
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            day_number:
              type: integer
              description: Day number in the course
            exercise_uuid:
              type: string
              description: UUID of exercise to add/update
            order_in_day:
              type: integer
              description: Position in the day's exercise list
            insert:
              type: boolean
              description: If true, inserts and shifts other exercises. If false, replaces existing exercise
    responses:
      200:
        description: Success response
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
      404:
        description: Course not found
      400:
        description: Day number exceeds course length
    """    
    db = get_db()
    data = request.json
    
    course = db.query(Course).filter_by(uuid=course_uuid).first()
    if not course:
        return jsonify({"error": "Course not found"}), 404
        
    if data['day_number'] > course.days_count:
        return jsonify({"error": "Day number exceeds course length"}), 400

    if data.get('insert', False):
        # Get all exercises for this day with equal or higher order
        exercises_to_move = db.query(CourseExercise).filter(
            CourseExercise.course_uuid == course_uuid,
            CourseExercise.day_number == data['day_number'],
            CourseExercise.order_in_day >= data['order_in_day']
        ).order_by(CourseExercise.order_in_day.asc()).all()

        # Increment their order
        for ex in exercises_to_move:
            ex.order_in_day += 1

    # Now add the new exercise or update existing
    existing = db.query(CourseExercise).filter_by(
        course_uuid=course_uuid,
        day_number=data['day_number'],
        order_in_day=data['order_in_day']
    ).first()

    if existing and not data.get('insert', False):
        existing.exercise_uuid = data['exercise_uuid']
    else:
        course_exercise = CourseExercise(
            course_uuid=course_uuid,
            exercise_uuid=data['exercise_uuid'],
            day_number=data['day_number'],
            order_in_day=data['order_in_day']
        )
        db.add(course_exercise)
    
    db.commit()
    return jsonify({"status": "success"})

@course_bp.route('/<course_uuid>/exercises/<exercise_uuid>', methods=['DELETE'])
def remove_course_exercise(course_uuid, exercise_uuid):
    """
    Remove an exercise from a course
    ---
    parameters:
      - name: course_uuid
        in: path
        type: string
        required: true
        description: UUID of the course
      - name: exercise_uuid
        in: path
        type: string
        required: true
        description: UUID of exercise to remove
    responses:
      200:
        description: Success response
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """    
    db = get_db()
    db.query(CourseExercise).filter_by(
        course_uuid=course_uuid,
        exercise_uuid=exercise_uuid
    ).delete()
    db.session.commit()
    return jsonify({"status": "success"})