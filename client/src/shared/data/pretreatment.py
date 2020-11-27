from datetime import datetime
import json
with open("/mnt/c/Users/qjqdn/DSC/PNUExtension/client/src/shared/data/regular-2020-2.json", "r") as data_json:
    data = json.load(data_json)


def selectCollege(d):
    return d['대학명']


def makeCagegoryWithCollege():
    colleges = list(set(list(map(selectCollege, data))))  # key list
    temp = []                                             # value list

    # make dictionary
    for i in range(0, len(colleges)):
        temp.append([])
    category = dict(zip(colleges, temp))

    # mapping
    for eachClass in data:
        category[eachClass['대학명']].append(eachClass['주관학과명'])
        category[eachClass['대학명']] = list(set(category[eachClass['대학명']]))

    with open("/mnt/c/Users/qjqdn/DSC/PNUExtension/client/src/shared/data/category.json", "w") as new_json:
        json.dump(category, new_json, ensure_ascii=False)


makeCagegoryWithCollege()


# def selectProp(d):
#     return d['교과구분']

# def makeClassCategory():
# category = list(set(list(map(selectProp(d, '주관학과명'), data))))
# with open("/mnt/c/Users/PC/DSC/PNUExtension/client/src/shared/data/department.json", "w") as json_file:
#     json.dump(category, json_file, ensure_ascii=False)

# classcategory = list(set(list(map(selectProp, data))))
# with open("/mnt/c/Users/PC/DSC/PNUExtension/client/src/shared/data/classcategory.json", "w") as json_file:
#     json.dump(classcategory, json_file, ensure_ascii=False)

# input
# 토 10:00-13:00 -
# 금 09:00-12:00 516-307
# output
# 화 16:30(75) 306-411,목 16:30(75) 306-411
# 0 12345678910

# def makeFormat(d):
#     time = d['시간표'].split(',')
#     if(len(time) == 1 and len(time[0]) > 7):
#         if(time[0][7] == '-'):
#             start = time[0][2:7]
#             end = time[0][8:13]
#             FMT = '%H:%M'
#             interval = '('+str((datetime.strptime(end, FMT) -
#                                 datetime.strptime(start, FMT)).seconds//60)+')'
#             newD = d
#             newD['시간표'] = time[0][0:7]+interval
#             return newD
#         else:
#             return d
#     else:
#         return d


# def dateFormPretreatment():
#     formatted = list(map(makeFormat, data))
#     with open("/mnt/c/Users/qjqdn/DSC/PNUExtension/client/src/shared/data/form-2020-2.json", "w") as json_file:
#         json.dump(formatted, json_file, ensure_ascii=False)


# dateFormPretreatment()
