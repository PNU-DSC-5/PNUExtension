from bs4 import BeautifulSoup as bs4
from selenium import webdriver
import re


def init():
    options = webdriver.ChromeOptions()
    options.add_argument('headless')
    options.add_argument('window-size=1920x1080')
    options.add_argument("disable-gpu")
    driver = webdriver.Chrome('chromedriver', options=options)
    # 나중에 옵션 삽입
    return driver


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


# 뉴스 1 인공지능 뉴스
def ai_news(driver):
    link = "http://www.aitimes.kr/"
    driver.get(link)
    driver.implicitly_wait(3)
    html = driver.page_source
    soup = bs4(html, 'html.parser')



def onoffmix(driver):
    link = "https://onoffmix.com/event?s=해커톤"
    driver.get(link)
    driver.implicitly_wait(3)
    html = driver.page_source
    soup = bs4(html, 'html.parser')


def main():
    driver = init()
    school_menus = school_menu(driver)
    ai = ai_news(driver)
    contest = onoffmix(driver)
    return


if __name__ == '__main__':
    main()
