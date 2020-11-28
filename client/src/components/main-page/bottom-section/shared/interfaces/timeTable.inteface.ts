export const DAYS = ['월', '화', '수', '목', '금', '토'];
export const TIMES = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
export const COLORS = ['#0c8599', '#ffd8a8', '#748ffc', '#1971c2', '#a5d8ff', '#ffa8a8', '#f08c00',
  '#40c057', '#f08c00', '#51cf66', '#99e9f2', '#495057', '#495057'];

export interface ClassCategory {
    [key: string]: string[];
}

export interface ClassTimeFormat {
  day: '월'|'화'| '수'| '목'| '금'| '토'|'일'| string;
  startTime: Date;
  endTime: Date;
}

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
