#import bluepy
import urllib.request, urllib.parse
import requests

#scanner, devices = bluepy.btle.Scanner(0), scanner.scan(3)

#count = 0
#for i in devices:
#    addr = device.addr
#    count += 1

addr2 = "1a:2b:3c:46:2b:3c"
count2 = 10

def post_message(addr):
    print("post")
    data = {}
    data["addr2"] = addr2
    url = "http://localhost:5000/2"
    #url = "http://localhost:4231/2"
    try:
        data = urllib.parse.urlencode(data).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST")
        with urllib.request.urlopen(req) as res:
            res = res.read().decode("utf-8")
            print(res)
    except:
        print('Error')

if __name__=='__main__':
    post_message(addr2)