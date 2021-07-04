from models.models import SensorCurrent
from models.database import db_session
import datetime
import csv

print("実行中...")

users = db_session.query(SensorCurrent).all()

for user in users:
    j = user.j_merged_num
    z = user.z_merged_num
    date = user.date
    date = date.strftime('%Y-%m-%d %H:%M:%S')
    print(j, z, date)

d_today = datetime.date.today()

csv_name = str(d_today) + ".csv"

with open(csv_name, 'w') as f:
    writer = csv.writer(f)
    writer.writerow([j, z, date])