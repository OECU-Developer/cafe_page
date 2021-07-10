from models.models import SensorCurrent
from models.database import db_session

print("レコード削除中...")
db_session.query(SensorCurrent).delete()
db_session.commit()
db_session.close()

print("削除完了")
print("初期データ挿入中...")

# 初期データ
data = SensorCurrent(10,10)
db_session.add(data)
db_session.commit()
db_session.close()

print("挿入完了")

# users = db_session.query(SensorCurrent).all()

# for user in users:
#     j = user.j_merged_num
#     z = user.z_merged_num
#     date = user.date
#     print(j, z, date.strftime('%Y-%m-%d %H:%M:%S'))

# print("\n--------------------\n")

# for user in users:
#     j = user.j_merged_num
#     z = user.z_merged_num
#     date = user.date
#     j = int((j - 109.25) / 0.7366)
#     z = int((z - 109.25) / 0.7366)
#     print(j, z, date.strftime('%Y-%m-%d %H:%M:%S'))
