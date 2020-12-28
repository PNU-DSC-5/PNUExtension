import React from 'react';

import {
  List, ListItem, Button, Drawer, Backdrop, Container,
  Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent, GridList, Grid,
} from '@material-ui/core';

import {
  makeStyles, createStyles, Theme, fade,
} from '@material-ui/core/styles';

import SettingsIcon from '@material-ui/icons/Settings';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

import moment from 'moment';
import { AxiosPromise } from 'axios';
import useAxios from 'axios-hooks';
import Carousel from 'react-material-ui-carousel';
import Slider from 'react-slick';
import useBasicDialog from '../../../../utils/hooks/useBasicDialog';

import WeekLine from './WeekLine';
import FilterDrawer from './FilterDrawer';
import CardTimeLine from './CardTimeLine';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import {
  SchoolClass, DAYS, COLORS, TIMES,
} from '../shared/interfaces/timeTable.inteface';

import { TimeStringToStringArray, CheckValidateNewClass, StringArrayToTime } from '../shared/utils/time-table.util';

const useStyles = makeStyles((theme: Theme) => createStyles({
  section: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  dialogRoot: {
    baclgroundColor: theme.palette.background.paper,
  },
  cardWrapper: {
    display: 'inline-flex',
    height: '100%',
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: 'column',
    borderRadius: 8,
    alignItems: 'center',
    // boxShadow: theme.shadows[5],
    backgroundColor: theme.palette.primary.main,
  },
  weekLineWrapper: {
    width: '10%',
    height: '780px',
  },
  slider: {
    width: '100%',
    height: '100%',
  },
  '@keyframes blinker': {
    from: { opacity: 1 },
    to: { opacity: 0.3 },
  },
  blinkIcon: {
    animationName: '$blinker',
    animationDuration: '1000ms',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
    animationTimingFunction: 'ease-in-out',
  },
}));

export interface WeekTableProps {
  schoolClasses: SchoolClass[];
  handleAddSchoolClassRequest: (newClass: SchoolClass) => void;
}

export default function WeekTable(): JSX.Element {
  const classes = useStyles();
  /* 다이얼로그 */
  const { open, handleClose, handleOpen } = useBasicDialog();
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

  const [{ data: schoolData }, getSchoolClasses] = useAxios<SchoolClass[]>({
    url: '/school-class',
    method: 'GET',
  }, { manual: true });

  const [{ loading: addClassLoading }, addSchoolClasses] = useAxios<boolean>({
    url: '/school-class',
    method: 'POST',
  }, { manual: true });

  const [{ loading: deleteClassLoading }, deleteSchoolClass] = useAxios<void>({
    url: '/school-class',
    method: 'DELETE',
  }, { manual: true });

  /* 2차원 배열 정의시 setState 비동기로 인해 문제 발생 -> 일단 6분할 */
  const [mon, setMon] = React.useState<SchoolClass[]>([]);
  const [tue, setTue] = React.useState<SchoolClass[]>([]);
  const [wen, setWen] = React.useState<SchoolClass[]>([]);
  const [thu, setThu] = React.useState<SchoolClass[]>([]);
  const [fri, setFri] = React.useState<SchoolClass[]>([]);
  const [sat, setSat] = React.useState<SchoolClass[]>([]);

  /**
   * 추가할 수업을 추가할 수 있는지 판단하고 추가 요청을 서버에
   * @param newClass 추가할 수업
   * @param targetList 유저의 보유 수업
   */
  const checkPossibleClassTime = (newClass: SchoolClass, targetList: SchoolClass[]): boolean => {
    const checkResult = CheckValidateNewClass(newClass, targetList);
    if (checkResult < 0) {
      alert('수업 시간이 중복 되어 추가 할 수 없습니다.');
      return false;
    } if (checkResult === 0) {
      alert('수업 시간이 겹쳐 추가 할 수 없습니다.');
      return false;
    }

    addSchoolClasses({
      data: { newClass },
    }).then(() => {
      alert(`${newClass.교과목명} 수업이 추가되었습니다!`);
    }).catch(() => {
      alert(`${newClass.교과목명} 수업을 추가하는데 실패했습니다. 다시 시도해주세요`);
    });

    return true;
  };

  /**
   * 수업 삭제 요청 핸들러
   * @param newClass 삭제할 수업
   */
  const handleRemoveClass = (newClass: SchoolClass) => {
    deleteSchoolClass({
      data: { newClass },
    }).then(() => {
      alert(`${newClass.교과목명} 수업이 삭제되었습니다!`);
      getSchoolClasses();
    }).catch(() => {
      alert(`${newClass.교과목명} 수업을 삭제하는데 실패했습니다. 다시 시도해주세요`);
    });
  };

  const handleMon = (newClass: SchoolClass, isRemove?: any) => {
    if (checkPossibleClassTime(newClass, mon) && !isRemove) setMon([...mon, newClass]);
  };
  const handleTue = (newClass: SchoolClass, isRemove?: any) => {
    if (checkPossibleClassTime(newClass, tue) && !isRemove) setTue([...tue, newClass]);
  };
  const handleWen = (newClass: SchoolClass, isRemove?: any) => {
    if (checkPossibleClassTime(newClass, wen) && !isRemove) setWen([...wen, newClass]);
  };
  const handleThu = (newClass: SchoolClass, isRemove?: any) => {
    if (checkPossibleClassTime(newClass, thu) && !isRemove) setThu([...thu, newClass]);
  };
  const handleFri = (newClass: SchoolClass, isRemove?: any) => {
    if (checkPossibleClassTime(newClass, fri) && !isRemove) setFri([...fri, newClass]);
  };
  const handleSat = (newClass: SchoolClass, isRemove?: any) => {
    if (checkPossibleClassTime(newClass, sat) && !isRemove) setSat([...sat, newClass]);
  };

  React.useEffect(() => {
    if (schoolData) {
      const colored = schoolData.map((each, index) => ({ ...each, color: COLORS[index] }));
      const funcList = [setMon, setTue, setWen, setThu, setFri, setSat];
      funcList.forEach((setFunc, index) => {
        setFunc(
          colored.filter(
            (each) => TimeStringToStringArray(each['시간표'])[0][0] === DAYS[index]
            || TimeStringToStringArray(each['시간표'])[1][0] === DAYS[index],
          ),
        );
      });
    }
  }, [schoolData]);

  React.useEffect(() => {
    getSchoolClasses();
  }, [getSchoolClasses]);

  /**
   * @param isOpen 수업 검색 drawer open state
   */
  const handleDrawer = (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown'
      && ((event as React.KeyboardEvent).key === 'Tab'
        || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      setDrawerOpen(false);
    }
    setDrawerOpen(isOpen);
  };

  const handleGetSchoolData = (): void => {
    getSchoolClasses();
  };

  const settings = {
    // dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  /**
   * 지난 수업인지 체크 요일은 필터링 됐다고 가정
   * @param target 수업
   */
  const checkIsCurrentClass = (target: SchoolClass) => {
    const currTime = moment(new Date());
    const targetTimes = StringArrayToTime(TimeStringToStringArray(target.시간표));
    // const checkTarget = targetTimes[0].day === DAYS[currTime.day() - 1] ? targetTimes[0] : targetTimes[1];
    // console.log(checkTarget, currTime.format('hh:mm'));

    const checkTarget = targetTimes[0];
    const formatedCurrTime = moment(`1997-06-07 ${currTime.format('HH:MM')}:00`);

    console.log(moment(formatedCurrTime).isAfter(moment(checkTarget.endTime)), 'asdfasdf');
    if (moment(formatedCurrTime).isAfter(moment(checkTarget.endTime))) {
      console.log(target, checkTarget);
      return false;
    }

    return true;
  };

  const dummy = [
    {
      연번: 1699,
      대학명: '사범대학',
      주관학과: 362100,
      주관학과명: '교육학과',
      학년: 3,
      교과목코드: 'XA40360',
      분반: '005',
      교과목명: '학교폭력예방및학생의이해',
      영문교과목명: 'UNDERSTANDING STUDENTS AND SCHOOL VIOLENCE PREVENTION',
      교과구분: '교직과목',
      학점: 2,
      이론: 2,
      실습: 0,
      교수명: '설정희',
      제한인원: 25,
      시간표: '월 16:00(30) 417-510',
      교양영역: '',
      원어: '',
      팀티칭: '',
      원격: '',
      비고: '',
    },
    {
      연번: 1716,
      대학명: '사범대학',
      주관학과: 362300,
      주관학과명: '유아교육과',
      학년: 2,
      교과목코드: 'ER34348',
      분반: '076',
      교과목명: '아동수학지도',
      영문교과목명: 'MATHEMATICS INSTRUCTION FOR CHILDREN',
      교과구분: '전공선택',
      학점: 3,
      이론: 3,
      실습: 0,
      교수명: '정혜영',
      제한인원: 19,
      시간표: '월 17:00(75) 211-A202,수 15:00(75) 211-A202',
      교양영역: '',
      원어: '',
      팀티칭: '',
      원격: '',
      비고: '',
    },
    {
      연번: 1754,
      대학명: '사범대학',
      주관학과: 363060,
      주관학과명: '통합사회전공',
      학년: 3,
      교과목코드: 'SD34599',
      분반: '075',
      교과목명: '통합사회논리및논술',
      영문교과목명: 'LOGIC & WRITING OF INTEGRATED SOCIAL SCIENCE EDUCATION',
      교과구분: '전공선택',
      학점: 3,
      이론: 3,
      실습: 0,
      교수명: '백종성/김효성/장혜진/박미향',
      제한인원: 15,
      시간표: '월 19:00(60) 417-102',
      교양영역: '',
      원어: '',
      팀티칭: 'Y',
      원격: '',
      비고: '',
    },
    {
      연번: 1,
      대학명: '교육혁신과',
      주관학과: 127100,
      주관학과명: '교육혁신과',
      학년: 0,
      교과목코드: 'EA12620',
      분반: '001',
      교과목명: '소비문화',
      영문교과목명: 'CONSUMER CULTURE',
      교과구분: '일반선택',
      학점: 3,
      이론: 3,
      실습: 0,
      교수명: '',
      제한인원: 30,
      시간표: '월 10:00(100)',
      교양영역: '',
      원어: '',
      팀티칭: '',
      원격: 'Y',
      비고: 'KNU-9',
    },
  ];

  return (
    <Paper className={classes.section}>
      {addClassLoading && <Backdrop open />}

      {/* 카드 뷰 컴포넌트 */}
      <div className={classes.cardWrapper}>
        <Button onClick={handleOpen}>
          <Typography variant="body1" align="center" color="textPrimary" style={{ fontWeight: 'bold' }}>
            Time Table
          </Typography>
        </Button>

        <div
          style={{
            width: 220,
            marginLeft: 8,
            marginRight: 8,
          }}
        >
          <Slider {...settings} className={classes.slider}>
            {schoolData && dummy.map((each, index) => ({ ...each, color: COLORS[index] }))
              .filter((each) => each.시간표[0] === '월' && checkIsCurrentClass(each))
              .map((each) => (
                <CardTimeLine
                  schoolClass={each}
                />
              ))}
          </Slider>
        </div>

      </div>

      {/* 다이얼로그 컴포넌트 */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        scroll="paper"
        PaperProps={{
          style: {
            backgroundColor: fade('#ffff', 1),
            borderRadius: 16,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" align="center" color="textSecondary" style={{ marginTop: '8px', fontWeight: 'bold' }}>
            시간표
          </Typography>
        </DialogTitle>

        <DialogContent
          style={{
            width: '1200px',
            height: '1000px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
          }}
        >

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <div
              style={{
                marginRight: 16,
                paddingTop: 32,
              }}
            >
              {TIMES.map((each) => (
                <Typography variant="h6" color="textSecondary" style={{ marginBottom: 28 }}>
                  {each < 10 ? `0${each}:00` : `${each}:00`}
                </Typography>
              ))}

            </div>

            <WeekLine
              schoolClasses={mon}
              targetWeek={DAYS[0]}
              handleRemoveClass={handleRemoveClass}
            />
            <WeekLine
              schoolClasses={tue}
              targetWeek={DAYS[1]}
              handleRemoveClass={handleRemoveClass}
            />
            <WeekLine
              schoolClasses={wen}
              targetWeek={DAYS[2]}
              handleRemoveClass={handleRemoveClass}
            />
            <WeekLine
              schoolClasses={thu}
              targetWeek={DAYS[3]}
              handleRemoveClass={handleRemoveClass}
            />
            <WeekLine
              schoolClasses={fri}
              targetWeek={DAYS[4]}
              handleRemoveClass={handleRemoveClass}
            />
            <WeekLine
              schoolClasses={sat}
              targetWeek={DAYS[5]}
              handleRemoveClass={handleRemoveClass}
            />
          </div>

          <IconButton
            style={{
              marginTop: 0,
              alignSelf: 'center',
              transform: 'rotate(-90deg)',
            }}
            onClick={handleDrawer(true)}
          >
            <DoubleArrowIcon style={{ color: 'black', fontSize: '32px' }} className={classes.blinkIcon} />
          </IconButton>

        </DialogContent>
      </Dialog>

      <FilterDrawer
        schoolData={schoolData || []}
        drawerOpen={drawerOpen}
        handleDrawer={handleDrawer}
        handlers={[handleMon, handleTue, handleWen, handleThu, handleFri, handleSat]}
        handleGetSchoolData={handleGetSchoolData}
      />
    </Paper>

  );
}
