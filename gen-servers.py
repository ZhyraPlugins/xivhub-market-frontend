from urllib import request
import csv
import json

url = "https://raw.githubusercontent.com/xivapi/ffxiv-datamining/master/csv/World.csv"

with request.urlopen(url) as res:
    lines = [l.decode("utf8") for l in res.readlines()]
    x = csv.reader(lines[3:])

    data = {}
    for row in x:
        # if public
        if row[6] == "True":
            data[int(row[0])] = {
                "name": row[2],
                "datacenter": int(row[5])
            }

    with open("src/servers.json", "w") as f:
        x = json.dumps(data)
        f.write(x)
