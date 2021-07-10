# -*- coding: utf-8 -*-

import time
import threading
import urllib.request, urllib.parse
from datetime import datetime


def schedule():
    addr = "1a:2b:3c:46:2b:3c 1a:2b:3c:46:2b:3c 1a:2b:3c:4e:5f:6g"

    print("post")
    data = {}
    data["addr"] = addr
    url = "http://127.0.0.1:4231"
    try:
        data = urllib.parse.urlencode(data).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST")
        with urllib.request.urlopen(req) as res:
            res = res.read().decode("utf-8")
            print(res)
    except:
        print('Error')


    addr2 = "1a:2b:3c:46:2b:3c"

    print("post")
    data = {}
    data["addr2"] = addr2
    url = "http://127.0.0.1:4231/2"
    try:
        data = urllib.parse.urlencode(data).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST")
        with urllib.request.urlopen(req) as res:
            res = res.read().decode("utf-8")
            print(res)
    except:
        print('Error')


    addr3 = "1a:2b:3c:46:2b:3c"

    print("post")
    data = {}
    data["addr3"] = addr3
    url = "http://127.0.0.1:4231/3"
    try:
        data = urllib.parse.urlencode(data).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST")
        with urllib.request.urlopen(req) as res:
            res = res.read().decode("utf-8")
            print(res)
    except:
        print('Error')


    addr4 = "1a:2b:3c:46:2b:3c"

    print("post")
    data = {}
    data["addr4"] = addr4
    url = "http://127.0.0.1:4231/4"
    try:
        data = urllib.parse.urlencode(data).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST")
        with urllib.request.urlopen(req) as res:
            res = res.read().decode("utf-8")
            print(res)
    except urllib.error.HTTPError as err:
        print(err.reason)

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
    scheduler(3, schedule, True)