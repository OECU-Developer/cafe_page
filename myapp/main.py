from flask import Flask, render_template, request, json, jsonify, Response
from flask_httpauth import HTTPDigestAuth
from models.models import SensorCurrent
from models.database import db_session
from datetime import datetime
import random
import flask_devices
import time

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
    counted_2 = counted_2
    counted_2 = int(counted_2 / 0.7366)
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
        return render_template('mobile_index.html', people=people)
    else:
        return render_template('index.html', people=people)

@app.route("/map")
def map():
    return render_template('map.html')

@app.route("/details")
def details():
    return render_template('details.html')

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
    users = db_session.query(SensorCurrent).first()

    j = users.j_merged_num
    z = users.z_merged_num
    date = datetime.now()

    print(j, z, date)
    data = SensorCurrent(j ,z , date)

    db_session.add(data)
    db_session.commit()
    db_session.close()
    people = SensorCurrent.query.first()

    json_data = {
        'j_merged_num': people.j_merged_num,
        'z_merged_num': people.z_merged_num
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