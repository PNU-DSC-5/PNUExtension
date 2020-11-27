export interface SchoolClass {
    연번: number;
    대학명: string;
    주관학과: number;
    주관학과명: string;
    학년: number;
    교과목코드: string;
    분반: string;
    교과목명: string;
    영문교과목명: string;
    교과구분: string;
    학점: number;
    이론: number;
    실습: number;
    교수명: string;
    제한인원: number;
    시간표: string;
    비고: string;
    팀티칭: string;
    원어: string;
    원격: string;
    교양영역: string;
    color?: string;
}

export interface ClassCategory {
    [key: string]: string[];
}

// "연번": 3755,
// "대학명": "교양교육원",
// "주관학과": 611000,
// "주관학과명": "교양교육원",
// "학년": 0,
// "교과목코드": "ZE10091",
// "분반": "029",
// "교과목명": "고전읽기와토론",
// "영문교과목명": "READING CLASSICS OF GREAT LITERATURE",
// "교과구분": "교양필수",
// "학점": 2,
// "이론": 2,
// "실습": 0,
// "교수명": "장혜진",
// "제한인원": 30,
// "시간표": "금 09:00(100) 417-407",
// "교양영역": "",
// "원어": "",
// "팀티칭": "",
// "원격": "",
// "비고": ""
