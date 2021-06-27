# -*- coding: utf-8 -*-

from flask import Flask
from main import app
from models.database import init_db

if __name__ == "__main__":
    init_db()
    app.run()