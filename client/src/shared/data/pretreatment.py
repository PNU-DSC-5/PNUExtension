import json
with open("/mnt/c/Users/PC/DSC/PNUExtension/client/src/shared/data/regular-2020-2.json", "r") as data_json:
    data = json.load(data_json)


def selectProp(d):
    return d['교과구분']


def makeClassCategory():
    # category = list(set(list(map(selectProp(d, '주관학과명'), data))))
    # with open("/mnt/c/Users/PC/DSC/PNUExtension/client/src/shared/data/department.json", "w") as json_file:
    #     json.dump(category, json_file, ensure_ascii=False)

    classcategory = list(set(list(map(selectProp, data))))
    with open("/mnt/c/Users/PC/DSC/PNUExtension/client/src/shared/data/classcategory.json", "w") as json_file:
        json.dump(classcategory, json_file, ensure_ascii=False)


# makeClassCategory()
