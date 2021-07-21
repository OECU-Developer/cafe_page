from flask import Flask, render_template, request, json, jsonify, Response, redirect, url_for
from flask_httpauth import HTTPDigestAuth
from models.models import SensorCurrent
from models.database import db_session
import datetime
import random
import flask_devices
import time
import urllib3
from bs4 import BeautifulSoup
import requests
import pandas as pd
import csv

#Google Oauth

from config import *
import json
import os
import re
os.environ["FLASK_APP"] = "main"
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
import sqlite3
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from oauthlib.oauth2 import WebApplicationClient
from db import init_db_command
from user import User

# 設定情報
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", GOOGLE_CLIENT_ID)
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", GOOGLE_CLIENT_SECRET)
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)

app = Flask(__name__, instance_path='/instance')
app.config.from_pyfile('app.cfg', silent=True)
app.config['SECRET_KEY'] = 'secret key here'
app.config['DIGEST_AUTH_FORCE'] = True

#セッション管理の設定
login_manager = LoginManager()
login_manager.init_app(app)

auth = HTTPDigestAuth()

devices = flask_devices.Devices(app)
devices.add_pattern('mobile', 'iPhone|iPod|Android.*Mobile|Windows.*Phone|dream|blackberry|CUPCAKE|webOS|incognito|webmate', 'templates/sp')
devices.add_pattern('pc', '.*', 'templates/pc')

users = {
    "user": "10ka1pin"
}

ADMIN_URL="960c9ce04ecc10d80106be257e52a3cf73258a2e4633a045b06a922c1de7208f"

addr = {''}

@login_manager.unauthorized_handler
def unauthorized():
    return "このページにアクセスするにはログインする必要があります。", 403

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

# Google Oauthデータベースの初期化
try:
    init_db_command()
except sqlite3.OperationalError:
    pass

# OAuth2クライアント設定
client = WebApplicationClient(GOOGLE_CLIENT_ID)

@app.route("/", methods=['POST'])
def info():
    global addr
    addr = str(request.form['addr'])
    addr = addr.split()
    addr = set(addr)
    if request.DEVICE == 'mobile':

        return render_template('mobile_index.html', addr=addr)
    else:
        return render_template('index.html', addr=addr)


@app.route("/2", methods=['POST'])
def info2():
    global addr2
    addr2 = str(request.form['addr2'])
    addr2 = addr2.split()
    addr2 = set(addr2)
    counted = len(list(addr | addr2))
    counted = int((counted - 34.5) / 0.741)
    print(counted)
    print("J 号館の値：" + str(counted))

    if counted < 0:
        counted = 0

    current = SensorCurrent.query.first()
    current.j_merged_num = int(counted)
    db_session.add(current)
    db_session.commit()
    db_session.close()
    if request.DEVICE == 'mobile':
        return render_template('mobile_index.html', addr2=addr2)
    else:
        return render_template('index.html', addr2=addr2)

addr3 = {''}

@app.route("/3", methods=['POST'])
def info3():
    global addr3
    addr3 = str(request.form['addr3'])
    addr3 = addr3.split()
    addr3 = set(addr3)
    if request.DEVICE == 'mobile':
        return render_template('mobile_index.html', addr3=addr3)
    else:
        return render_template('index.html', addr3=addr3)

@app.route("/4", methods=['POST'])
def info4():
    global addr4
    addr4 = str(request.form['addr4'])
    addr4 = addr4.split()
    addr4 = set(addr4)
    counted_2 = len(list(addr3 | addr4))
    counted_2 = int((counted_2 - 27.3) / 0.903)
    print("Z 号館の値：" + str(counted_2))

    if counted_2 < 0:
        counted_2 = 0

    current_2 = SensorCurrent.query.first()
    current_2.z_merged_num = int(counted_2)
    db_session.add(current_2)
    db_session.commit()
    if request.DEVICE == 'mobile':
        return render_template('mobile_index.html', addr4=addr4)
    else:
        return render_template('index.html', addr4=addr4)



@app.route("/")
def index():
    people = SensorCurrent.query.first()
    if request.DEVICE == 'mobile':
        #アクセスするURL
        url = 'https://weather.yahoo.co.jp/weather/jp/27/6200.html'
        http = urllib3.PoolManager()
        instance = http.request('GET', url)
        soup = BeautifulSoup(instance.data, 'html.parser')
        nettyusyo_today = soup.select_one('#main > div.mdheatstrokeInduction > div.mdheatstroke_contents > ul > li > dl > dd > p.comment')
        #tenki.jpの目的の地域のページのURL（今回は東京都調布市）
        url = 'https://tenki.jp/forecast/6/30/6200/27215/'
        r = requests.get(url)
        """
        proxies = {
            "http":"http://proxy.xxx.xxx.xxx:8080",
            "https":"http://proxy.xxx.xxx.xxx:8080"
        }
        r = requests.get(url, proxies=proxies)
        """
        #HTMLの解析
        bsObj = BeautifulSoup(r.content, "html.parser")
        #今日の天気を取得
        today = bsObj.find(class_="today-weather")
        today_weather = today.p.string
        #明日の天気を取得
        tomorrow = bsObj.find(class_="tomorrow-weather")
        tomorrow_weather = tomorrow.p.string
        #気温情報のまとまり
        temp=today.div.find(class_="date-value-wrap")

        #気温の取得
        temp=temp.find_all("dd")
        temp_max = temp[0].span.string #最高気温
        temp_max_diff=temp[1].string #最高気温の前日比
        temp_min = temp[2].span.string #最低気温
        temp_min_diff=temp[3].string #最低気温の前日比

        return render_template('startup.html', people=people,heatstroke=nettyusyo_today.text,weather=today_weather)
    else:
        return render_template('index.html', people=people)

@app.route("/home")
def home():
    people = SensorCurrent.query.first()
    return render_template('mobile_index.html', people=people)       

@app.route("/login_page")
def login_page():
    return render_template('login_page.html')

@app.route("/J_details")
def J_details():
    return render_template('J_details.html')

@app.route("/Z_details")
def Z_details():
    return render_template('Z_details.html')

@app.route("/overview")
def overview():
    return render_template('overview.html')

@auth.get_password
def get_pw(username):
    if username in users:
        return users.get(username)
    return None


@app.route("/"+str(ADMIN_URL))
@auth.login_required
def admin_get():
    username = auth.username()

    people = SensorCurrent.query.first()
    rasp_date = datetime.now() - people.date
    rasp_date = str(rasp_date)

    return render_template('admin.html', username=username, rasp_date=rasp_date)

@app.route("/"+str(ADMIN_URL), methods=['POST'])
def admin_post():
    j_empty = request.form['j_empty']
    j_little_empty = request.form['j_little_empty']
    j_little_crowded = request.form['j_little_crowded']
    j_crowded = request.form['j_crowded']

    z_empty = request.form['z_empty']
    z_little_empty = request.form['z_little_empty']
    z_little_crowded = request.form['z_little_crowded']
    z_crowded = request.form['z_crowded']
    return render_template('admin.html', j_empty=j_empty, j_little_empty=j_little_empty, \
                            j_little_crowded=j_little_crowded, j_crowded=j_crowded, \
                            z_empty=z_empty, z_little_empty=z_little_empty, \
                            z_little_crowded=z_little_crowded, z_crowded=z_crowded)

# Ajax処理
@app.route("/people", methods=['POST'])
def getCurrData():
    data1 = db_session.query(SensorCurrent).first()

    j = data1.j_merged_num
    z = data1.z_merged_num
    now = datetime.datetime.now()

    print(j, z, now)
    data2 = SensorCurrent(j ,z , now)

    db_session.add(data2)
    db_session.commit()
    db_session.close()

    df_j = pd.read_csv('predict/j.csv')
    print(df_j)

    df_z = pd.read_csv('predict/z.csv')
    print(df_z)

    j_1 = int(df_j['j_1'])
    j_2 = int(df_j['j_2'])
    j_3 = int(df_j['j_3'])
    j_4 = int(df_j['j_4'])
    j_5 = int(df_j['j_5'])

    z_1 = int(df_z['z_1'])
    z_2 = int(df_z['z_2'])
    z_3 = int(df_z['z_3'])
    z_4 = int(df_z['z_4'])
    z_5 = int(df_z['z_5'])

    people = SensorCurrent.query.first()

    J_people=[
        people.j_merged_num,
        j_1,
        j_2,
        j_3,
        j_4,
        j_5
    ]
    Z_people=[
        people.z_merged_num,
        z_1,
        z_2,
        z_3,
        z_4,
        z_5
    ]

    json_data = {
        'j_merged_num': J_people,
        'z_merged_num': Z_people
    }

    print(json_data)
    return jsonify(Result=json.dumps(json_data))

def generate_random_data():
    data = SensorCurrent.query.first()
    json_data = json.dumps(
        {
            "time": datetime.now().strftime("%H:%M"),
            "j_value": data.j_merged_num,
            "z_value": data.z_merged_num,
        }
    )
    yield f"data:{json_data}\n\n"



@app.route("/chart-data")
def chart_data():
    time.sleep(5)
    return Response(generate_random_data(), mimetype="text/event-stream")

#Google Oauth用route
@app.route("/myPage")
def myPage():
    if current_user.is_authenticated:
        return (
            "<p>Hello, {}! You're logged in! Email: {}</p>"
            "<div><p>Google Profile Picture:</p>"
            '<img src="{}" alt="Google profile pic"></img></div>'
            '<a class="button" href="/myPage/logout">Logout</a>'.format(
                current_user.name, current_user.email, current_user.profile_pic
            )
        )
    else:
        return '<a class="button" href="/myPage/login">Google Login</a>'
 
@app.route("/myPage/login")
def login():
    # 認証用のエンドポイントを取得する
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    # ユーザプロファイルを取得するログイン要求
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)


@app.route("/myPage/login/callback")
def callback():
    # Googleから返却された認証コードを取得する
    code = request.args.get("code")

    #トークンを取得するためのURLを取得する
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # トークンを取得するための情報を生成し、送信する
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    # トークンをparse
    client.parse_request_body_response(json.dumps(token_response.json()))

    # トークンができたので、GoogleからURLを見つけてヒットした、
    # Googleプロフィール画像やメールなどのユーザーのプロフィール情報を取得
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # メールが検証されていれば、名前、email、プロフィール画像を取得します
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        
        if not re.search("@oecu\.jp$",users_email):
            return "このページにアクセスするにはoecu.jpドメインのGoogleアカウントでログインする必要があります。", 400
        
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400

    # Googleから提供された情報をもとに、Userを生成する
    user = User(
        id_=unique_id, name=users_name, email=users_email, profile_pic=picture
    )

    # 登録されていない場合は、データベースへ登録する
    if not User.get(unique_id):
        User.create(unique_id, users_name, users_email, picture)

    # ログインしてユーザーセッションを開始
    login_user(user)

    return redirect(url_for("myPage"))

@app.route("/myPage/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("myPage"))

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html', message="STATUS: 404 リクエスト URL が見つからないため、違う URL で試してください")

if __name__ == "__main__":
    app.run(threaded=True)