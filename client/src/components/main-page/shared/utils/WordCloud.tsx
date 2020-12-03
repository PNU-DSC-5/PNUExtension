import React from 'react';
import ReactWordcloud from 'react-wordcloud';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { makeStyles, Grid } from '@material-ui/core';
// import dummy from './dummy';


const dummy = [

  {
    text: 'chiropractor',
    value: 1,
  },
  {
    text: 'treatment',
    value: 2,
  },
  {
    text: 'tooth',
    value: 3,
  },
  {
    text: 'chiropractic',
    value: 4,
  },
  {
    text: 'dr',
    value: 5,
  },
  {
    text: 'relief',
    value: 6,
  },
  {
    text: 'shoulder',
    value: 7,
  },
  {
    text: 'nurse',
    value: 8,
  },
  {
    text: 'room',
    value: 9,
  },
  {
    text: 'hour',
    value: 10,
  },
  {
    text: 'wait',
    value: 11,
  },
  {
    text: '홍윤영',
    value: 20,
  },
  {
    text: '김리나',
    value: 20,
  },
  {
    text: '김법우',
    value: 20,
  },
  {
    text: '정보 컴퓨터 공학부',
    value: 21,
  },
  {
    text: 'medical',
    value: 16,
  },
  {
    text: 'question',
    value: 17,
  },
  {
    text: '부산대학교',
    value: 30,
  },
  {
    text: 'DSC 3기',
    value: 22,
  },
  {
    text: 'minute',
    value: 20,
  },

];

type MinMaxPair = [number, number];
type scale = 'undefined' | 'linear' | 'sqrt' | 'log' ;
const wordScale: scale = 'sqrt';
const sizeNum: MinMaxPair = [5, 60];
const rotNum: MinMaxPair = [0, 0];
const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 350,
    height: 950,
    width: 800,
    justifyContent: 'center',
    alignItems: 'center',
    justifyItems: 'center',
    alignContent: 'center',
  },
}));
const options = {
  colors: ['#339af0', '#a5d8ff','#1864ab'],
  enableTooltip: true,
  deterministic: false,
  fontFamily: 'impact',
  fontSizes: sizeNum,
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  scale: wordScale,
  rotations: 3,
  rotationAngles: rotNum,
  transitionDuration: 1500,
};

function WordCloud(): JSX.Element {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} lg={10}>
            <ReactWordcloud options={options} words={dummy} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
export default WordCloud;