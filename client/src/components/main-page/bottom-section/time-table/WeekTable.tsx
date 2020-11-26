import React from 'react';

import {
  List, ListItem, Button, Drawer, Backdrop, Container,
  Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent, GridList, Grid
} from '@material-ui/core';

import {
  makeStyles, createStyles, Theme, fade,
} from '@material-ui/core/styles';

import SettingsIcon from '@material-ui/icons/Settings';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

import moment from 'moment';
import { AxiosPromise } from 'axios';
import useAxios from 'axios-hooks';
import useBasicDialog from '../../../../utils/hooks/useBasicDialog';

import WeekLine from './WeekLine';
import FilterDrawer from './FilterDrawer';
import CardTimeLine from './CardTimeLine'
import Carousel from 'react-material-ui-carousel'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

import { SchoolClass } from '../shared/interfaces/timeTable.inteface';

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
  weekLineWrapper: {
    width: '10%',
    height: '780px',
    // marginRight: '4px',
    // border: '1px solid black',
  },
  slider: {
    '&>ul>li': {
      width: 50,
    },
    width: '95%',
    margin: 'auto',
    height: 'px'
  },
  '@keyframes blinker': {
    from: { opacity: 1 },
    to: { opacity: 0.3 }
  },
  blinkIcon: {
    animationName: '$blinker',
    animationDuration: '1000ms',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
    animationTimingFunction: 'ease-in-out',
  }
}));

function splitTimeString(str: string) {
  const result = str.split(',');
  if (result.length > 1) {
    return result;
  }
  result.push('일');

  return result;
}
const colors = [
  '#0c8599', '#ffd8a8', '#748ffc', '#1971c2', '#a5d8ff', '#ffa8a8', '#f08c00',
  '#40c057', '#f08c00', '#51cf66', '#99e9f2', '#495057', '#495057',
];
export interface WeekTableProps {
  schoolClasses: SchoolClass[];
  handleAddSchoolClassRequest: (newClass: SchoolClass) => void;
}

export default function WeekTable(): JSX.Element {
  const classes = useStyles();
  /* 다이얼로그 */
  const { open, handleClose, handleOpen } = useBasicDialog();
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

  const [{ data: schoolData }] = useAxios<SchoolClass[]>({
    url: '/school-class',
    method: 'GET',
  });

  const [{ loading: addClassLoading }, addSchoolClass] = useAxios<boolean>({
    url: '/school-class',
    method: 'POST',
  }, { manual: true });

  /* 2차원 배열 정의시 setState 비동기로 인해 문제 발생 -> 일단 6분할 */
  const [mon, setMon] = React.useState<SchoolClass[]>([]);
  const [tue, setTue] = React.useState<SchoolClass[]>([]);
  const [wen, setWen] = React.useState<SchoolClass[]>([]);
  const [thu, setThu] = React.useState<SchoolClass[]>([]);
  const [fri, setFri] = React.useState<SchoolClass[]>([]);
  const [sat, setSat] = React.useState<SchoolClass[]>([]);
  const days = ['월', '화', '수', '목', '금', '토'];


  /**
   * str -> number
   * @param timeStr hh:mm
   */
  const checkPossibleClassTime = (newClass: SchoolClass, targetList: SchoolClass[]): boolean => {
    // 월 13:00(139)
    const timeStrList = targetList.map((each) => each['시간표'].split(',')[0].slice(2, 7));
    const newTime = newClass['시간표'].split(',')[0].slice(2, 7);

    if (timeStrList.includes(newTime) || addClassLoading) {
      /* 겹치는 시간이 존재 하는지 확인 요일, 시간 */
      alert('수업 시간이 겹쳐 추가 할 수 없습니다.');
      return false;
    }
    addSchoolClass({
      data: { newClass },
    });
    return true;
  };

  const handleMon = (newClass: SchoolClass) => {
    if (checkPossibleClassTime(newClass, mon)) setMon([...mon, newClass]);
  };
  const handleTue = (newClass: SchoolClass) => {
    if (checkPossibleClassTime(newClass, tue)) setTue([...tue, newClass]);
  };
  const handleWen = (newClass: SchoolClass) => {
    if (checkPossibleClassTime(newClass, wen)) setWen([...wen, newClass]);
  };
  const handleThu = (newClass: SchoolClass) => {
    if (checkPossibleClassTime(newClass, thu)) setThu([...thu, newClass]);
  };
  const handleFri = (newClass: SchoolClass) => {
    if (checkPossibleClassTime(newClass, fri)) setFri([...fri, newClass]);
  };
  const handleSat = (newClass: SchoolClass) => {
    if (checkPossibleClassTime(newClass, sat)) setSat([...sat, newClass]);
  };

  React.useEffect(() => {

    if (schoolData) {
      const colored = schoolData.map((each, index) => ({ ...each, color: colors[index] }));
      setMon(colored.filter((each) => splitTimeString(each['시간표'])[0][0] === '월' || splitTimeString(each['시간표'])[1][0] === '월'));
      setTue(colored.filter((each) => splitTimeString(each['시간표'])[0][0] === '화' || splitTimeString(each['시간표'])[1][0] === '화'));
      setWen(colored.filter((each) => splitTimeString(each['시간표'])[0][0] === '수' || splitTimeString(each['시간표'])[1][0] === '수'));
      setThu(colored.filter((each) => splitTimeString(each['시간표'])[0][0] === '목' || splitTimeString(each['시간표'])[1][0] === '목'));
      setFri(colored.filter((each) => splitTimeString(each['시간표'])[0][0] === '금' || splitTimeString(each['시간표'])[1][0] === '금'));
      setSat(colored.filter((each) => splitTimeString(each['시간표'])[0][0] === '토' || splitTimeString(each['시간표'])[1][0] === '토'));
    }
  }, [schoolData]);

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

  /**
   * 지난 수업인지 체크
   * @param target 수업
   */
  const checkIsCurrentClass = (target: SchoolClass) => {
    // 월 13:00(100)
    const time = Number(target.시간표.split(',')[0].slice(2, 7));
    const interval = Number(target.시간표.split(',')[0][11] === ')' ?
      target.시간표.split(',')[0].slice(8, 11) : target.시간표.split(',')[0].slice(8, 10)) / 60;

    const currTime = Number(moment(new Date()).format('HH'));

    return currTime <= time + interval
  }

  const settings = {
    // dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <Paper className={classes.section}>
      {addClassLoading && <Backdrop open />}

      {/* 카드 뷰 컴포넌트 */}
      <div
        style={{
          display: 'inline-flex',
          height: '100%',
          paddingLeft: 24,
          paddingRight: 24,
          flexDirection: 'column',
          backgroundColor: '#adb5bd',
          borderRadius: 4
        }}
      >
        <Button onClick={handleOpen}>
          <Typography variant="body1" align="center" style={{ fontWeight: 'bold' }}>
            Time Table
          </Typography>
        </Button>

        <Slider {...settings} className={classes.slider}>
          {schoolData && schoolData.map((each, index) => ({ ...each, color: colors[index] }))
            .filter((each) => checkIsCurrentClass(each))
            .map((each) => (
              <CardTimeLine schoolClass={each} />
            ))}
        </Slider>
      </div>

      {/* 다이얼로그 컴포넌트 */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        scroll="paper"
        PaperProps={{
          style: {
            backgroundColor: fade('#495057', 1),
            borderRadius: 32,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" align="center" style={{ color: 'white' }}>
            시간표
          </Typography>
        </DialogTitle>

        <DialogContent
          style={{
            width: '1200px',
            height: '900px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
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

            <WeekLine
              schoolClasses={mon}
              targetWeek={days[0]}
            />
            <WeekLine
              schoolClasses={tue}
              targetWeek={days[1]}
            />
            <WeekLine
              schoolClasses={wen}
              targetWeek={days[2]}
            />
            <WeekLine
              schoolClasses={thu}
              targetWeek={days[3]}
            />
            <WeekLine
              schoolClasses={fri}
              targetWeek={days[4]}
            />
            <WeekLine
              schoolClasses={sat}
              targetWeek={days[5]}
            />
          </div>

          <IconButton
            style={{
              marginTop: 56,
              alignSelf: 'center',
              transform: "rotate(-90deg)"
            }}
            onClick={handleDrawer(true)}
          >
            <DoubleArrowIcon style={{ color: 'white', fontSize: '40px' }} className={classes.blinkIcon} />
          </IconButton>

        </DialogContent>
      </Dialog>

      <FilterDrawer
        drawerOpen={drawerOpen}
        handleDrawer={handleDrawer}
        handlers={[handleMon, handleTue, handleWen, handleThu, handleFri, handleSat]}
      />
    </Paper >

  );
}
