import React from 'react';
// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// material-ui core components
import { Grid } from '@material-ui/core';
// app components
import BottomSectionLayout from '../components/main-page/layout/BottomSectionLayout';
import TopSectionLayout from '../components/main-page/layout/TopSectionLayout';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  topSection: {
    minHeight: '400px',
    backgroundColor: theme.palette.primary.main,
    paddingTop: '64px',
    // marginTop: '32px',
  },
  bottomSection: {
    marginTop: theme.spacing(2),
    minHeight: '2300px',
    backgroundColor: theme.palette.background.paper,
    paddingTop: '20px',
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
}));

/*
  <제작 필요 컴포넌트>

  상단 섹션 :   검색창, 즐겨찾기 , 로고? , 배경 고화질 이미지? ...
  
  하단 섹션 :   식단, IT뉴스 , 학과 공지사항, 투두 리스트 
*/

export default function Main(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* 메인페이지 상단 섹션 */}
      <Grid container className={classes.topSection}>
        <TopSectionLayout />
      </Grid>

      {/* 메인페이지 하단 섹션 */}
      <Grid container className={classes.bottomSection}>
        <BottomSectionLayout />
      </Grid>
    </div>
  );
}
