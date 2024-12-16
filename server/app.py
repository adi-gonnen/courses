
from flask import Flask
from app.routes.exercises import exercise_bp
from app.routes.courses import course_bp
from app.database import init_db
from flasgger import Swagger
app = Flask(__name__)
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec',
            "route": '/apispec.json',
            "rule_filter": lambda rule: True,  # all in
            "model_filter": lambda tag: True,  # all in
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/docs"
}

swagger = Swagger(app, config=swagger_config)
app.register_blueprint(exercise_bp, url_prefix='/exercises')
app.register_blueprint(course_bp, url_prefix='/courses')

init_db()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1337)