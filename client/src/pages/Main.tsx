import React from 'react';
// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// material-ui core components
import { Grid, Typography } from '@material-ui/core';
// app components
import BottomTest from '../components/main-page/bottom-section/BottomSectionTest';
import TopTest from '../components/main-page/top-section/TopSectionTest';

import BackGround from '../public/space.jpg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    topSection: {
        minHeight: '500px',
        backgroundColor: theme.palette.primary.dark,
        paddingTop: '20px',
        backgroundImage: `url(${BackGround})`,
        backgroundSize: 'cover',
    }, 
    bottomSection: {
        minHeight: '2300px',
        backgroundColor: theme.palette.primary.dark,
        paddingTop: '20px'  
    }
  }),
);

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
                <TopTest />
            </Grid>
            
            {/* 메인페이지 하단 섹션 */}
            <Grid container className={classes.bottomSection}>
                <BottomTest/>
            </Grid>

        </div>
    );
}