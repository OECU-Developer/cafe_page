# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, String, DateTime
from models.database import Base
from datetime import datetime


"""
センサー情報_保存テーブル
"""
class SensorCurrent(Base):
    __tablename__ = 'people'
    id = Column(Integer, primary_key=True)
    j_merged_num = Column(Integer)
    z_merged_num = Column(Integer)
    date = Column(DateTime, default=datetime.now())

    def __init__(self, j_merged_num=None, z_merged_num=None, date=None):
        self.j_merged_num = j_merged_num
        self.z_merged_num = z_merged_num
        self.date = date


"""
管理者_ログイン情報_保存テーブル
"""
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(20))
    password = Column(String(100))

    def __init__(self, username=None, password=None):
        self.username = username
        self.password = password


"""
混雑度の閾値
"""
class Crowd(Base):
    __tablename__ = 'crowd'
    id = Column(Integer, primary_key=True)
    j_empty = Column(Integer)
    j_little_empty = Column(Integer)
    j_little_crowded = Column(Integer)
    j_crowded = Column(Integer)

    z_empty = Column(Integer)
    z_little_empty = Column(Integer)
    z_little_crowded = Column(Integer)
    z_crowded = Column(Integer)

    def __init__(self, j_empty=None, j_little_empty=None, \
                j_little_crowded=None, j_crowded=None, \
                z_empty=None, z_little_empty=None, \
                z_little_crowded=None, z_crowded=None):
        self.j_empty = j_empty
        self.j_little_empty = j_little_empty
        self.j_little_crowded = j_little_crowded
        self.j_crowded = j_crowded
        self.z_empty = z_empty
        self.z_little_empty = z_little_empty
        self.z_little_crowded = z_little_crowded
        self.z_crowded = z_crowded
