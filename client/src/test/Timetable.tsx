import React from 'react';
import { makeStyles, createStyles, Theme, fade } from '@material-ui/core/styles';
import { Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import regular202002 from '../shared/data/regular-2020-2.json';
import SettingsIcon from '@material-ui/icons/Settings';
import useBasicDialog from '../utils/hooks/useBasicDialog';
import BottomTest from '../components/main-page/bottom-section/BottomSection';

import WeekTable from '../components/main-page/bottom-section/time-table/WeekTable';

const dummy = [
  {
    "연번": 1699,
    "대학명": "사범대학",
    "주관학과": 362100,
    "주관학과명": "교육학과",
    "학년": 3,
    "교과목코드": "XA40360",
    "분반": "005",
    "교과목명": "학교폭력예방및학생의이해",
    "영문교과목명": "UNDERSTANDING STUDENTS AND SCHOOL VIOLENCE PREVENTION",
    "교과구분": "교직과목",
    "학점": 2,
    "이론": 2,
    "실습": 0,
    "교수명": "설정희",
    "제한인원": 25,
    "시간표": "화 17:00 (100) 417-510",
    "교양영역": "",
    "원어": "",
    "팀티칭": "",
    "원격": "",
    "비고": ""
  },
  {
    "연번": 1716,
    "대학명": "사범대학",
    "주관학과": 362300,
    "주관학과명": "유아교육과",
    "학년": 2,
    "교과목코드": "ER34348",
    "분반": "076",
    "교과목명": "아동수학지도",
    "영문교과목명": "MATHEMATICS INSTRUCTION FOR CHILDREN",
    "교과구분": "전공선택",
    "학점": 3,
    "이론": 3,
    "실습": 0,
    "교수명": "정혜영",
    "제한인원": 19,
    "시간표": "화 15:00 (75) 211-A202,목 15:00 (75) 211-A202",
    "교양영역": "",
    "원어": "",
    "팀티칭": "",
    "원격": "",
    "비고": ""
  },
  {
    "연번": 1754,
    "대학명": "사범대학",
    "주관학과": 363060,
    "주관학과명": "통합사회전공",
    "학년": 3,
    "교과목코드": "SD34599",
    "분반": "075",
    "교과목명": "통합사회논리및논술",
    "영문교과목명": "LOGIC & WRITING OF INTEGRATED SOCIAL SCIENCE EDUCATION",
    "교과구분": "전공선택",
    "학점": 3,
    "이론": 3,
    "실습": 0,
    "교수명": "백종성/김효성/장혜진/박미향",
    "제한인원": 15,
    "시간표": "금 14:00 (180) 417-102",
    "교양영역": "",
    "원어": "",
    "팀티칭": "Y",
    "원격": "",
    "비고": ""
  },
  {
    "연번": 1,
    "대학명": "교육혁신과",
    "주관학과": 127100,
    "주관학과명": "교육혁신과",
    "학년": 0,
    "교과목코드": "EA12620",
    "분반": "001",
    "교과목명": "소비문화",
    "영문교과목명": "CONSUMER CULTURE",
    "교과구분": "일반선택",
    "학점": 3,
    "이론": 3,
    "실습": 0,
    "교수명": "",
    "제한인원": 30,
    "시간표": "토 10:00 (180)",
    "교양영역": "",
    "원어": "",
    "팀티칭": "",
    "원격": "Y",
    "비고": "KNU-9"
  },
]


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      height: '100%',
      width: '100%',

      display: 'flex',
      flexDirection: 'column'
    },
  }),
);

export default function Timetable(): JSX.Element {
  const classes = useStyles();
  const { open, handleClose, handleOpen } = useBasicDialog();

  return (
    <Paper className={classes.section}>
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
        <DialogTitle
        >
          <Typography variant="h6" align="center" style={{ color: 'white' }}>
            시간표
          </Typography>
        </DialogTitle>

        <DialogContent style={{
          width: '1300px',
          height: '900px',
          color: 'white'
        }}>
          {/* <Schedule /> */}
          {/* <Test
            dummy={dummy}
          /> */}
          <WeekTable
            schoolClasses={dummy}
          />
        </DialogContent>
      </Dialog>

    </Paper>
  );
}
