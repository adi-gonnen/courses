from flask import Blueprint, jsonify, request
from app.models.exercise import Exercise
from app.database import get_db

exercise_bp = Blueprint('exercises', __name__)

@exercise_bp.route('/', methods=['GET'])
def get_exercises():
    """
    Get all exercises
    ---
    responses:
      200:
        description: List of all exercises
        schema:
          type: array
          items:
            type: object
            properties:
              uuid:
                type: string
                description: Exercise unique identifier
              title:
                type: string
                description: Exercise title
              instructions:
                type: array
                items:
                  type: string
                description: List of instructions
              video_url:
                type: string
                description: URL to exercise video
    """
    db = get_db()
    exercises = db.query(Exercise).all()
    return jsonify([e.to_dict() for e in exercises])

@exercise_bp.route('/<uuid>', methods=['PUT'])
def update_exercise(uuid):
    """
    Update an exercise
    ---
    parameters:
      - name: uuid
        in: path
        type: string
        required: true
        description: UUID of exercise to update
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
              description: New exercise title
            instructions:
              type: array
              items:
                type: string
              description: New list of instructions
            video_url:
              type: string
              description: New video URL
    responses:
      200:
        description: Updated exercise
        schema:
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
      404:
        description: Exercise not found
    """  
    db = get_db()
    exercise = db.query(Exercise).filter_by(uuid=uuid).first()
    if not exercise:
        return jsonify({"error": "Exercise not found"}), 404
    
    data = request.json
    original = exercise.to_dict()
    
    for key in ['title', 'instructions', 'video_url']:
        if key in data:
            setattr(exercise, key, data[key])
    
    # log = ExerciseChangeLog(
    #     exercise_uuid=uuid,
    #     original=original,
    #     changes=data
    # )
    # db.session.add(log)
    db.session.commit()
    
    return jsonify(exercise.to_dict())

# @exercise_bp.route('/<uuid>/changes', methods=['GET'])
# def get_exercise_changes(uuid):
#     db = get_db()
#     exercise = db.query(Exercise).filter_by(uuid=uuid).first()
#     if not exercise:
#         return jsonify({"error": "Exercise not found"}), 404
    
#     changes = db.query(ExerciseChangeLog)\
#         .filter_by(exercise_uuid=uuid)\
#         .order_by(ExerciseChangeLog.change_date)\
#         .all()
    
#     return jsonify([change.to_dict() for change in changes])