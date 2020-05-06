from flask import Flask
from .byob import game_blueprint


def create_app():
    app = Flask(__name__)
    app.register_blueprint(game_blueprint)
    app.secret_key = b'bladdseh'

    return app
