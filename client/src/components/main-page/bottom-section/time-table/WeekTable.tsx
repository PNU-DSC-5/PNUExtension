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

import { SchoolClass, DAYS, COLORS, TIMES,  } from '../shared/interfaces/timeTable.inteface';
  SchoolClass, DAYS, COLORS, TIMES,
} from '../shared/interfaces/timeTable.inteface';
import { TimeStringToStringArray, CheckValidateNewClass } from '../shared/utils/time-table.util';

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
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
  },
  weekLineWrapper: {
    width: '10%',
    height: '780px',
  },
  slider: {
    '&>ul>li': {
      width: 50,
    },
    width: '95%',
    margin: 'auto',
    height: 'px',
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
      alert(`${newClass.교과목명} 수업이 추가하는데 실패했습니다. 다시 시도해주세요`);
    });

    return true;
  };

  const handleRemoveClass = (newClass: SchoolClass) => {
    
  }

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

  /**
   * 지난 수업인지 체크
   * @param target 수업
   */
  const checkIsCurrentClass = (target: SchoolClass) => {
    // 월 13:00(100)
    const time = Number(target.시간표.split(',')[0].slice(2, 7));
    const interval = Number(target.시간표.split(',')[0][11] === ')'
      ? target.시간표.split(',')[0].slice(8, 11) : target.시간표.split(',')[0].slice(8, 10)) / 60;

    const currTime = Number(moment(new Date()).format('HH'));
    return currTime <= time + interval;
  };

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
      <div className={classes.cardWrapper}>
        <Button onClick={handleOpen}>
          <Typography variant="body1" align="center" color="textPrimary" style={{ fontWeight: 'bold' }}>
            Time Table
          </Typography>
        </Button>

        <Slider {...settings} className={classes.slider}>
          {schoolData && schoolData.map((each, index) => ({ ...each, color: COLORS[index] }))
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
            />
            <WeekLine
              schoolClasses={tue}
              targetWeek={DAYS[1]}
            />
            <WeekLine
              schoolClasses={wen}
              targetWeek={DAYS[2]}
            />
            <WeekLine
              schoolClasses={thu}
              targetWeek={DAYS[3]}
            />
            <WeekLine
              schoolClasses={fri}
              targetWeek={DAYS[4]}
            />
            <WeekLine
              schoolClasses={sat}
              targetWeek={DAYS[5]}
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
