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
}
``
export interface ClassCategory {
  [key: string]: string[];
}