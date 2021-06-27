#import bluepy
import urllib.request, urllib.parse
#import settings


#Seed = settings.Seed

#scanner = bluepy.btle.Scanner(0)
#devices = scanner.scan(3)

#count = 0
#for i in devices:
#    addr = device.addr
#    hash_str = str(df_t) + addr
#    hash_str = hashlib.sha256(hash_str.encode()).hexdigest()
#    count += 1

addr = "1a:2b:3c:46:2b:3c 1a:2b:3c:46:2b:3c 1a:2b:3c:4e:5f:6g 9a:2b:3c:4e:5f:6g"

def post_message(addr):
    print("post")
    data = {}
    data["addr"] = addr
    url = "http://localhost:5000"
    #url = "http://localhost:4231"
    try:
        data = urllib.parse.urlencode(data).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST")
        with urllib.request.urlopen(req) as res:
            res = res.read().decode("utf-8")
            print(res)
    except:
        print('Error')

if __name__=='__main__':
    post_message(addr)