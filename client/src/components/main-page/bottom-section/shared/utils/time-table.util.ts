import moment from 'moment';
import { DAYS, SchoolClass, ClassTimeFormat } from '../interfaces/timeTable.inteface';

/**
 * 2개 날짜 스트링을 2개 스트링 배열로 분할 + 예외처리
 * @param str 월 12:00(130), 수 12:00(130) 포맷의 스트링
 */
export const TimeStringToStringArray = (str: string): string[] => {
  const result = str.split(',');
  if (DAYS.includes(result[0][0])) {
    if (result.length > 1) {
      return result;
    }
    result.push('일');
    return result;
  } return ['일', '일'];
};

/**
 * 스트링에서 ClasTimeForamt 으로
 * @param str 월 12:00(130) 형태의 스트링
 */
export const makeClassTimeFormat = (str: string): ClassTimeFormat => {
  const result: ClassTimeFormat = {
    day: str[0],
    startTime: new Date(0),
    endTime: new Date(0),
  };

  try {
    if (result.day !== '일') {
      const interval = str[11] === ')' ? Number(str.slice(8, 11)) : Number(str.slice(8, 10));
      result.startTime = moment(`1997-06-07 ${str.slice(2, 7)}:00`).toDate();
      result.endTime = moment(result.startTime).add(interval, 'minute').toDate();
    }
    return result;
  } catch {
    return result;
  }
};

/**
 * 시간 문자열 배열을 요일 시간 객체로 변환
 * @param str ['월 12:00(130)', '수 12:00(130)']
 */
export const StringArrayToTime = (
  strArr: string[],
): ClassTimeFormat[] => strArr.map(
  (each) => makeClassTimeFormat(each),
);

/**
 * 추가 가능한 수업인지 확인 
 * 1. 수업 중복 검사
 * 2. 수업 시간 중복 검사
 * @param newClass 새로 추가할 수업 객체
 * @param originClasses 기존의 유저 수업 객체 리스트
 */
export const CheckValidateNewClass = (newClass: SchoolClass, originClasses: SchoolClass[]): number => {
  const newClassTimes = StringArrayToTime(TimeStringToStringArray(newClass.시간표));
  const originClassTimes = originClasses
    .map((eachOrigin) => TimeStringToStringArray(eachOrigin.시간표))
    .map((eachTimes) => StringArrayToTime(eachTimes))
    .reduce((acc, curr) => acc.concat(curr), []);

  const dupledFlag = originClassTimes.some(
    (each) => (
      each.day === newClassTimes[0].day && each.day !== '일'
      && ((each.startTime.getTime() <= newClassTimes[0].startTime.getTime()
      && newClassTimes[0].startTime.getTime() <= each.endTime.getTime())
      || (each.startTime.getTime() <= newClassTimes[0].endTime.getTime()
      && newClassTimes[0].endTime.getTime() <= each.endTime.getTime()))
    ) || (
      each.day === newClassTimes[1].day && each.day !== '일'
      && ((each.startTime.getTime() <= newClassTimes[1].startTime.getTime()
      && newClassTimes[1].startTime.getTime() <= each.endTime.getTime())
      || (each.startTime.getTime() <= newClassTimes[1].endTime.getTime()
      && newClassTimes[1].endTime.getTime() <= each.endTime.getTime()))
    ),
  );

  if (originClasses.map((eachOrigin) => eachOrigin.연번).includes(newClass.연번)) {
    /* 1. 동일한 연번이 포함 된 경우 */
    return -1;
  } if (dupledFlag) {
    /* 2. 수업 시간이 겹칠 경우 */
    return 0;
  }
  return 1;
};
