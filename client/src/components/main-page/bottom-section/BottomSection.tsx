import React from 'react';
import Crawling from './Crawling';
import Timetable from './Timetable';
import MealPlanner from './MealPlanner';
import Todo from './Todo';

// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Grid, { GridSpacing } from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      backgroundColor: 'white',
      borderRadius: 30,
      width: '19%',
      height: 300,
      margin: '0.5%',
      display: 'inline-block',
      //whiteSpace: 'nowrap',
    },
  }),
);

export default function BottomTest(): JSX.Element {
  const classes = useStyles();

  const category = [
    { id: 1, text: '학부 공지사항' },
    {
      id: 2,
      text: 'IT1',
    },
    {
      id: 3,
      text: 'IT2',
    },
    {
      id: 4,
      text: 'IT3',
    },
    {
      id: 5,
      text: '수업, 학식, TODO',
    },
    {
      id: 6,
      text: 'IT4',
    },
    {
      id: 7,
      text: 'IT5',
    },
  ];
  const SpecialSection = (): JSX.Element => {
    return (
      <div>
        <Timetable />
        <MealPlanner />
        <Todo />
      </div>
    );
  };

  const ITtimesSection = (text: string): JSX.Element => {
    return <Crawling content={text} />;
  };

  const bottomSection = category.map((elem) => {
    const { id, text } = elem;
    const content = { text }.text;
    return (
      <div className={classes.section}>
        {id === 5 ? SpecialSection() : ITtimesSection(content)}
      </div>
    );
  });
  return <div style={{ width: '100%' }}>{bottomSection}</div>;
}
