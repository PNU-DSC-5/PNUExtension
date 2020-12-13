export interface Card {
    _id: number;
    title: string;
    href: string;
    date: string; //info와 news에 존재
    tag: string;
    category: string;
    context: string; //contest에 존재
    imghref: string; //사진 경로
}

// "id": 13,
// "title" : "[소프트웨어교육센터] SW전공 온라인 특강 안내_Redis 특강 및 생체정보인증을 위한 A"
// "href" : "https://cse.pusan.ac.kr/bbs/cse/2605/841239/artclView.do?layout=unknown"
// "date" : "2020-11-30"
// "tag" : "정보컴퓨터공학과"
// "category" : "부산대학교"
// "context" : "2020.11.11 (수) 0:00 ~ 2020.11.30 (월) 23:59"
// "imghref" : ""
