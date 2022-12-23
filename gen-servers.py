from urllib import request
import csv
import json

url = "https://raw.githubusercontent.com/xivapi/ffxiv-datamining/master/csv/World.csv"

datacenters = {
    0: 'Aether',
    1: 'Elemental',
    2: 'Gaia',
    3: 'Mana',
    4: 'Aether',
    5: 'Primal',
    6: 'Chaos',
    7: 'Light',
    8: 'Crystal',
    9: 'Materia',
    10: 'Meteor',
    11: 'Dynamis'
}

with request.urlopen(url) as res:
    lines = [l.decode("utf8") for l in res.readlines()]
    x = csv.reader(lines[3:])

    data = dict()
    worlds = dict()
    for row in x:
        # if public
        if row[6] == "True" and row[5] != "0":
            datacenter = int(row[5])
            name = row[2]
            id = int(row[0])

            if datacenter not in data:
                data[datacenter] = {
                    "name": datacenters[datacenter],
                    "worlds": dict()
                }

            data[datacenter]["worlds"][id] = name
            worlds[id] = {
                "name": name,
                "datacenter": datacenter
            }

    with open("src/servers.json", "w") as f:
        x = json.dumps(data)
        f.write(x)
    with open("src/worlds.json", "w") as f:
        x = json.dumps(worlds)
        f.write(x)
