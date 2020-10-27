from bs4 import BeautifulSoup as bs4
from selenium import webdriver
import re
import datetime

now = datetime.datetime.now()
nowDate = now.strftime('%Y-%m-%d')

def init():
    options = webdriver.ChromeOptions()
    options.add_argument('headless')
    options.add_argument('window-size=1920x1080')
    options.add_argument("disable-gpu")
    # Chrome Headless 우회
    options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36")
    options.add_argument("lang=ko_KR")
    # 혹은 options.add_argument("--disable-gpu")
    driver = webdriver.Chrome('C:/yoonyoung/PNUExtension/crawler/driver/chromedriver', options=options)
    # 빈 페이지
    driver.get("about:blank")
    # Chrome Headless 우회(플러그인 막기)
    driver.execute_script("Object.defineProperty(navigator, 'plugins', {get: function() {return[1, 2, 3, 4, 5];},});")
    # Chrome Headless 우회(한국어)
    driver.execute_script("Object.defineProperty(navigator, 'languages', {get: function() {return ['ko-KR', 'ko']}})")
    # Chrome headless 우회(그래픽 가속)
    driver.execute_script(
        "const getParameter = WebGLRenderingContext.getParameter;WebGLRenderingContext.prototype.getParameter = function(parameter) {if (parameter === 37445) {return 'NVIDIA Corporation'} if (parameter === 37446) {return 'NVIDIA GeForce GTX 980 Ti OpenGL Engine';}return getParameter(parameter);};")
    return driver


# 학과공지
def cse_info(driver):
    data = []
    url = "https://cse.pusan.ac.kr"

    driver.get(url)
    driver.implicitly_wait(3)
    html = driver.page_source
    soup = bs4(html, "html.parser")
    notions = soup.find("ul", attrs={"class": "recentBbsInnerUl", "id": "recentBbsArtclObj_757_1281"})
    notions = notions.find_all("li")
    for n in notions:
        _data = {}
        _data["title"] = n.strong.text.split('\n')[0]
        _data["href"] = url + n.a.attrs['href']
        _data["date"] = n.find("span", class_="data").text
        _data["tag"] = 0
        data.append(_data)
    return data


# 학식
def school_menu(driver):
    """
    Datas :
        code :
            1 금정 교직원 , 2 금정 학생,
            3 문창 교직원 , 4 문창 학생,
            5 샛별 식당 ,  6 학생회관 교직원,
            7 학생회관 학생
        time :
            0 : 아침
            1 : 점심
            2 : 저녁

    param driver: 셀레니움 웹드라이버
    return 학식 메뉴 정보
    """
    Datas = []
    _data = {}
    link = "http://www.pusan.ac.kr/kor/CMS/MenuMgr/menuListOnWeekly.do?mCode=MN203"  # 학식 홈페이지
    driver.get(link)  # selenium 이동
    driver.implicitly_wait(3)
    html = driver.page_source  # html 다운

    soup = bs4(html, 'html.parser')  # bs4로 html 파싱
    date = soup.find("title")  # 해당 날짜

    for id in range(1, 8):
        time = 0 if id == 2 else 1
        menus = soup.select(f"tbody > tr:nth-child({id}) > td > ul")
        for menu in menus:
            _data["code"] = id
            _data["time"] = time
            _data["menu"] = menu.text.strip().split("\n")
            time += 1
            Datas.append(_data)
            _data = {}
    return Datas


# 뉴스 1 인공지능 뉴스 10개
def ai_news(driver):
    """
     제목 / 링크 / 날짜 / 태그(신문사)
     태그 0 : aitimes.kr
     카테고리 : 인공지능 (0)

    """
    global nowDate # 크롤링 날짜
    link = "http://www.aitimes.kr"
    data = []                                       # 데이터
    driver.get(link)                                # driver 셀레니움 접속
    driver.implicitly_wait(3)                       # 3초 기다림 국룰임
    html = driver.page_source                       # html source 받아오기
    soup = bs4(html, 'html.parser')                 # BeatifulSoup을 이용해서 파싱
    elements = soup.find_all("li", class_="clearfix auto-martop-8")   # 인기 기사에 해당하는 태그 및 속성
    top = soup.find("li", class_="clearfix")        # Top1 기사는 CSS 때문에 다르게 설정한 듯
    data.append({'title': top.img.attrs["alt"], 'href': link + top.a.attrs['href'], 'date': nowDate, 'tag':0, 'category':0})
    for element in elements:
        _data = {}
        _data['title'] = element.text  # 뉴스제목
        _data['href'] = link + element.a.attrs['href']     # 뉴스링크
        _data['date'] = nowDate                     # 현재날짜
        _data['tag'] = 0                            # 신문사 = aitimes(0)
        _data["category"] = 0                       # 카테고리 = 인공지능(0)
        data.append(_data)
    return data                                     # data 반환




def onoffmix(driver):
    data = []
    link = "https://onoffmix.com/event/main?s=%23%ED%95%B4%EC%BB%A4%ED%86%A4"
    driver.get(link)
    driver.implicitly_wait(3)
    html = driver.page_source
    soup = bs4(html, 'html.parser')
    elements = soup.find_all("article", class_="event_area event_main")
    for e in elements:
        _data = {}
        _data["title"] = e.img.attrs["alt"]                              # 제목
        _data["context"] = e.find("span", class_="date").text            # 기한
        _data['href'] = "https://onoffmix.com" + e.a.attrs['href']      # 링크
        _data['category'] = 0                                            # 카테고리 : 0 IT
        data.append(_data)
    return data


def printffff(dict):
    for i in dict:
        print(i)
    return


def main():
    driver = init()
    info = cse_info(driver)
    menu = school_menu(driver)
    ai = ai_news(driver)
    onoff = onoffmix(driver)
    printffff(menu)
    printffff(ai)
    printffff(onoff)
    printffff(info)
    return


if __name__ == '__main__':
    main()
