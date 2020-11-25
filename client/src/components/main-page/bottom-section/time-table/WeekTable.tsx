import React from 'react';

import {
  List, ListItem, Button, Drawer,
  Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent,
} from '@material-ui/core';

import {
  makeStyles, createStyles, Theme, fade,
} from '@material-ui/core/styles';

import SettingsIcon from '@material-ui/icons/Settings';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

import moment from 'moment';
import useBasicDialog from '../../../../utils/hooks/useBasicDialog';

import WeekLine from './WeekLine';
import FilterDrawer from './FilterDrawer';

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
}));

function splitTimeString(str: string) {
  const result = str.split(',');
  if (result.length > 1) {
    return result;
  }
  result.push('일');

  return result;
}

export interface WeekTableProps {
  schoolClasses: SchoolClass[];
  handleAddSchoolClassRequest: (newClass: SchoolClass) => void;
}

export default function WeekTable(props: WeekTableProps): JSX.Element {
  const { schoolClasses, handleAddSchoolClassRequest } = props;
  const classes = useStyles();
  /* 다이얼로그 */
  const { open, handleClose, handleOpen } = useBasicDialog();
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

  /* 2차원 배열 정의시 setState 비동기로 인해 문제 발생 -> 일단 6분할 */
  const [mon, setMon] = React.useState<SchoolClass[]>(schoolClasses.filter((each) => splitTimeString(each['시간표'])[0][0] === '월' || splitTimeString(each['시간표'])[1][0] === '월'));
  const [tue, setTue] = React.useState<SchoolClass[]>(schoolClasses.filter((each) => splitTimeString(each['시간표'])[0][0] === '화' || splitTimeString(each['시간표'])[1][0] === '화'));
  const [wen, setWen] = React.useState<SchoolClass[]>(schoolClasses.filter((each) => splitTimeString(each['시간표'])[0][0] === '수' || splitTimeString(each['시간표'])[1][0] === '수'));
  const [thu, setThu] = React.useState<SchoolClass[]>(schoolClasses.filter((each) => splitTimeString(each['시간표'])[0][0] === '목' || splitTimeString(each['시간표'])[1][0] === '목'));
  const [fri, setFri] = React.useState<SchoolClass[]>(schoolClasses.filter((each) => splitTimeString(each['시간표'])[0][0] === '금' || splitTimeString(each['시간표'])[1][0] === '금'));
  const [sat, setSat] = React.useState<SchoolClass[]>(schoolClasses.filter((each) => splitTimeString(each['시간표'])[0][0] === '토' || splitTimeString(each['시간표'])[1][0] === '토'));

  const days = ['월', '화', '수', '목', '금', '토'];

  const checkPossibleClassTime = (newClass: SchoolClass, targetList: SchoolClass[]): boolean => {
    // 월 13:00(139)
    const timeStrList = targetList.map((each) => each['시간표'].split(',')[0].slice(2, 7));
    const newTime = newClass['시간표'].split(',')[0].slice(2, 7);

    if (timeStrList.includes(newTime)) {
      /* 겹치는 시간이 존재 하는지 확인 요일, 시간 */
      alert('수업 시간이 겹쳐 추가 할 수 없습니다.');
      return false;
    }
    else {
      handleAddSchoolClassRequest(newClass);
      return true;
    }
  }

  const handleMon = (newClass: SchoolClass) => {
    if (checkPossibleClassTime(newClass, mon)) setMon([...mon, newClass]);
  }
  const handleTue = (newClass: SchoolClass) => {
    if (checkPossibleClassTime(newClass, tue)) setTue([...tue, newClass]);
  }
  const handleWen = (newClass: SchoolClass) => {
    if (checkPossibleClassTime(newClass, wen)) setWen([...wen, newClass]);
  }
  const handleThu = (newClass: SchoolClass) => {
    if (checkPossibleClassTime(newClass, thu)) setThu([...thu, newClass]);
  }
  const handleFri = (newClass: SchoolClass) => {
    if (checkPossibleClassTime(newClass, fri)) setFri([...fri, newClass]);
  }
  const handleSat = (newClass: SchoolClass) => {
    if (checkPossibleClassTime(newClass, sat)) setSat([...sat, newClass]);
  }

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

  React.useEffect(() => {
    console.log(mon[0] === mon[1])
  }, [mon])

  return (
    <Paper className={classes.section}>
      {/* 카드 뷰 컴포넌트 */}
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h6"
          style={{
            verticalAlign: 'middle',
          }}
        >
          Timetable
        </Typography>

        <IconButton
          onClick={handleOpen}
        >
          <SettingsIcon />
        </IconButton>
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
          }}
        >

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 0
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

            <IconButton
              style={{
                alignSelf: 'center',
                position: 'absolute',
                marginLeft: 1100,
              }}
              onClick={handleDrawer(true)}
            >
              <DoubleArrowIcon style={{ color: 'white', fontSize: '40px' }} />
            </IconButton>

            <FilterDrawer
              drawerOpen={drawerOpen}
              handleDrawer={handleDrawer}
              handlers={[handleMon, handleTue, handleWen, handleThu, handleFri, handleSat]}
            />

          </div>
        </DialogContent>
      </Dialog>

    </Paper>

  );
}
