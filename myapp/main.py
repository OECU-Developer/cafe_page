from flask import Flask, render_template, request, json, jsonify, Response
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
import pmdarima as pm


app = Flask(__name__, instance_path='/instance')
app.config.from_pyfile('app.cfg', silent=True)
app.config['SECRET_KEY'] = 'secret key here'
app.config['DIGEST_AUTH_FORCE'] = True
auth = HTTPDigestAuth()

devices = flask_devices.Devices(app)
devices.add_pattern('mobile', 'iPhone|iPod|Android.*Mobile|Windows.*Phone|dream|blackberry|CUPCAKE|webOS|incognito|webmate', 'templates/sp')
devices.add_pattern('pc', '.*', 'templates/pc')

users = {
    "user": "10ka1pin"
}

ADMIN_URL="960c9ce04ecc10d80106be257e52a3cf73258a2e4633a045b06a922c1de7208f"

addr = {''}

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

@app.route("/map")
def map():
    return render_template('map.html')

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


    users = db_session.query(SensorCurrent).all()

    csv_name =  "output.csv"

    with open(csv_name, 'w') as f:
        for user in users:
            j = user.j_merged_num
            z = user.z_merged_num
            date = user.date
            date = date.strftime('%Y-%m-%d %H:%M:%S')
            writer = csv.writer(f)
            writer.writerow([j, z, date])

    df = pd.read_csv(csv_name)
    df.columns = ['j', 'z', 'date']


    # datetime 型に変換
    df["date"] = pd.to_datetime(df["date"])
    # 1分間にまとめる
    df = df.groupby(pd.Grouper(key='date', freq='1min')).mean().reset_index()
    print(df.head(10))
    # 0埋め
    df = df.fillna(0)

    # date をインデックスにする
    df = df.set_index("date")

    # 今日の日付
    today = datetime.date.today()
    print(today)
    
    # 今日だけを取り出す
    df = df[str(today):str(today)]

    print(df.head(10))

    print("len(df)："+str(len(df)))
    print(df.isnull().sum())

    # Fit an ARIMA
    arima_j = pm.ARIMA(order=(4, 2, 0),seasonal=True,enforce_stationarity=False)
    arima_j.fit(df["j"])

    arima_z = pm.ARIMA(order=(4, 2, 0),seasonal=True,enforce_stationarity=False)
    arima_z.fit(df["z"])

    preds_j = arima_j.predict(n_periods=5)
    print("J 号館の予測：" + str(preds_j))

    preds_z = arima_z.predict(n_periods=5)
    print("Z 号館の予測：" + str(preds_z))

    j_1 = int(preds_j[0])
    j_2 = int(preds_j[1])
    j_3 = int(preds_j[2])
    j_4 = int(preds_j[3])
    j_5 = int(preds_j[4])

    z_1 = int(preds_z[0])
    z_2 = int(preds_z[1])
    z_3 = int(preds_z[2])
    z_4 = int(preds_z[3])
    z_5 = int(preds_z[4])

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

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html', message="STATUS: 404 リクエスト URL が見つからないため、違う URL で試してください")

if __name__ == "__main__":
    app.run(threaded=True)