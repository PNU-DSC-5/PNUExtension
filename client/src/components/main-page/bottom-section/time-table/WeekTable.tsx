import React from 'react';

import {
  List, ListItem, Button,
  Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent
} from '@material-ui/core';

import { makeStyles, createStyles, Theme, fade } from '@material-ui/core/styles';

import SettingsIcon from '@material-ui/icons/Settings';

import useBasicDialog from '../../../../utils/hooks/useBasicDialog';

import moment from 'moment';

import WeekLine from './WeekLine';
import TodayLine from './TodayLine';

import { SchoolClass } from '../shared/interfaces/timeTable.inteface';

interface WeekTableProps {
  schoolClasses: SchoolClass[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      height: '100%',
      width: '100%',

      display: 'flex',
      flexDirection: 'column'
    },
    root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    weekLineWrapper: {
      width: '10%',
      height: '780px',
      marginRight: '4px',
      // border: '1px solid black',
    }
  }),
);

function splitTimeString(str: string) {
  const result = str.split(',');
  if (result.length > 1)
    return result;
  result.push('일');

  // console.log(result)
  return result;
}

interface WeeksType {
  state: SchoolClass[];
  func: React.Dispatch<React.SetStateAction<SchoolClass[]>>;
}

const addDummy = {
  "연번": 1523,
  "대학명": "공과대학",
  "주관학과": 346734,
  "주관학과명": "토목공학전공",
  "학년": 2,
  "교과목코드": "CR15220",
  "분반": "047",
  "교과목명": "일반화학실험(I)",
  "영문교과목명": "GENERAL CHEMISTRY LABORATORY(I)",
  "교과구분": "전공선택",
  "학점": 1,
  "이론": 0,
  "실습": 2,
  "교수명": "박영상",
  "제한인원": 10,
  "시간표": "금 17:00(100) 606-416",
  "교양영역": "",
  "원어": "",
  "팀티칭": "",
  "원격": "",
  "비고": ""
};

export default function WeekTable(props: WeekTableProps): JSX.Element {
  const { schoolClasses } = props;
  const classes = useStyles();
  /* 다이얼로그 */
  const { open, handleClose, handleOpen } = useBasicDialog();

  /* 2차원 배열 정의시 setState 비동기로 인해 문제 발생 -> 일단 6분할 */
  const [mon, setMon] = React.useState<SchoolClass[]>(schoolClasses.filter((each) => splitTimeString(each['시간표'])[0][0] === '월' || splitTimeString(each['시간표'])[1][0] === '월'));
  const [tue, setTue] = React.useState<SchoolClass[]>(schoolClasses.filter((each) => splitTimeString(each['시간표'])[0][0] === '화' || splitTimeString(each['시간표'])[1][0] === '화'));
  const [wen, setWen] = React.useState<SchoolClass[]>(schoolClasses.filter((each) => splitTimeString(each['시간표'])[0][0] === '수' || splitTimeString(each['시간표'])[1][0] === '수'));
  const [thu, setThu] = React.useState<SchoolClass[]>(schoolClasses.filter((each) => splitTimeString(each['시간표'])[0][0] === '목' || splitTimeString(each['시간표'])[1][0] === '목'));
  const [fri, setFri] = React.useState<SchoolClass[]>(schoolClasses.filter((each) => splitTimeString(each['시간표'])[0][0] === '금' || splitTimeString(each['시간표'])[1][0] === '금'));
  const [sat, setSat] = React.useState<SchoolClass[]>(schoolClasses.filter((each) => splitTimeString(each['시간표'])[0][0] === '토' || splitTimeString(each['시간표'])[1][0] === '토'));

  /* 요일 라인을 합친 상태값 */
  const [weeks, setWeeks] = React.useState<WeeksType[]>([
    { state: mon, func: setMon },
    { state: tue, func: setTue },
    { state: wen, func: setWen },
    { state: thu, func: setThu },
    { state: fri, func: setFri },
    { state: sat, func: setSat }]);
  const days = ['월', '화', '수', '목', '금', '토'];

  const handleAddClassToWeek = (newClass: SchoolClass, targetWeek: string) => {
    const targetIndex = days.indexOf(targetWeek);
    weeks[targetIndex].func([...weeks[targetIndex].state, newClass]);
  }

  const handleSubClassToWeek = (reomveClass: SchoolClass, targetWeek: string) => {
    const targetIndex = days.indexOf(targetWeek);
    weeks[targetIndex].func(weeks[targetIndex].state.filter((eachClass) => eachClass['연번'] !== reomveClass['연번']));
  }

  return (
    <Paper className={classes.section}>
      {/* 카드 뷰 컴포넌트 */}
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography
          variant="h6"
          style={{
            verticalAlign: 'middle'
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
            backgroundColor: fade('#495057', 0.9),
            borderRadius: 32
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" align="center" style={{ color: 'white' }}>
            시간표
          </Typography>
        </DialogTitle>

        <DialogContent
          style={{
            width: '1500px',
            height: '900px',
            color: 'white'
          }}
        >

          <div
            style={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >

            {weeks.map((week, index) => (
              <WeekLine
                schoolClasses={week.state}
                targetWeek={days[index]}
              />
            ))}

            <div
              style={{
                marginLeft: '32px'
              }}
            >
              <TodayLine />
            </div>

          </div>
        </DialogContent>
      </Dialog>

    </Paper>

  )
}
/* <WeekLine schoolClasses={mon} targetWeek="월" />
      <WeekLine schoolClasses={tue} targetWeek="화" />
      <WeekLine schoolClasses={wen} targetWeek="수" />
      <WeekLine schoolClasses={thu} targetWeek="목" />
      <WeekLine schoolClasses={fri} targetWeek="금" />
      <WeekLine schoolClasses={sat} targetWeek="토" /> */