# -*- coding: utf-8 -*-

import time
import threading
import urllib.request, urllib.parse
import datetime
from models.models import SensorCurrent
from models.database import db_session
from models.database import engine
import csv
import pandas as pd
import pmdarima as pm

def schedule():
    users = db_session.query(SensorCurrent).all()

    df_sensor = pd.read_sql_query(sql=u"SELECT j_merged_num, z_merged_num, date FROM people WHERE date > date(CURRENT_TIMESTAMP);", con=engine)

    # datetime 型に変換
    df_sensor["date"] = pd.to_datetime(df_sensor["date"])
    # 2分間にまとめる
    df_sensor = df_sensor.groupby(pd.Grouper(key='date', freq='1min')).mean().reset_index()
    # 0埋め
    df_sensor = df_sensor.fillna(0)

    # date をインデックスにする
    df_sensor = df_sensor.set_index("date")

    # 今日の日付
    today = datetime.date.today()
    print(today)
        
    # 今日だけを取り出す
    df_sensor = df_sensor[str(today):str(today)]

    print("len(df_sensor)："+str(len(df_sensor)))

    # Fit an ARIMA
    arima_j = pm.ARIMA(order=(4, 2, 0),seasonal=True,enforce_stationarity=False)
    arima_j.fit(df_sensor["j_merged_num"])

    arima_z = pm.ARIMA(order=(4, 2, 0),seasonal=True,enforce_stationarity=False)
    arima_z.fit(df_sensor["z_merged_num"])

    preds_j = arima_j.predict(n_periods=5)
    print("J 号館の予測：" + str(preds_j))

    preds_z = arima_z.predict(n_periods=5)
    print("Z 号館の予測：" + str(preds_z))

    for i in range(5):
        if preds_j[i] <= 0:
            preds_j[i] = 0
        
    for i in range(5):
        if preds_z[i] <= 0:
            preds_z[i] = 0

    with open('myapp/predict/j.csv', 'w') as file:
        writer = csv.writer(file)
        writer.writerow(['j_1', 'j_2', 'j_3', 'j_4', 'j_5'])
        writer.writerow(preds_j)
        
    with open('myapp/predict/z.csv', 'w') as file:
        writer = csv.writer(file)
        writer.writerow(['z_1', 'z_2', 'z_3', 'z_4', 'z_5'])
        writer.writerow(preds_z)

    df_sensor_date = df_sensor.tail(10)
    print(df_sensor_date)
    
    df_sensor_date.to_csv('myapp/predict/date.csv')

    df_sensor_j = pd.read_csv('myapp/predict/j.csv')
    print(df_sensor_j)

    df_sensor_z = pd.read_csv('myapp/predict/z.csv')
    print(df_sensor_z)


def scheduler(interval, f, wait = True):
    base_time = time.time()
    next_time = 0
    while True:
        t = threading.Thread(target = f)
        t.start()
        if wait:
            t.join()
        next_time = ((base_time - time.time()) % interval) or interval
        time.sleep(next_time)

if __name__ == "__main__":
    scheduler(20, schedule, True)