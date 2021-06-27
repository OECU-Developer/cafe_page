#import bluepy
import urllib.request, urllib.parse
import requests
import hashlib
import datetime

#scanner = bluepy.btle.Scanner(0)
#devices = scanner.scan(3)

now_t = datetime.datetime.now()

df_t = now_t.strftime('%Y-%m-%d %H:%M')

#count = 0
#for i in devices:
#    addr = device.addr
#    hash_str = str(df_t) + addr
#    hash_str = hashlib.sha256(hash_str.encode()).hexdigest()
#    count += 1

addr3 = "1a:2b:3c:46:2b:3c 8a:2b:3c:46:2b:3c"

# ソルト(現在の分数) + MAC アドレス
hash_str = str(df_t) + addr3
# sha-256 でハッシュ化
hash_str = hashlib.sha256(hash_str.encode()).hexdigest()

def post_message(addr3):
    print("post")
    data = {}
    data["addr3"] = addr3
    url = "http://localhost:5000/3"
    #url = "http://localhost:4231/3"
    try:
        data = urllib.parse.urlencode(data).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST")
        with urllib.request.urlopen(req) as res:
            res = res.read().decode("utf-8")
            print(res)
    except:
        print('Error')

if __name__=='__main__':
    post_message(addr3)