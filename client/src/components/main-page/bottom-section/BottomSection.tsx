import React from 'react';
import Crawling from './Crawling';
import Timetable from './Timetable';
import MealPlanner from './MealPlanner';
import Todo from './Todo';

// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Grid, { GridSpacing } from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: '100%',
      height: '100%',
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

  const CrawlingSection = (text: string): JSX.Element => {
    return <Crawling content={text} />;
  };

  const SpecialSection = (): JSX.Element => {
    return (
      <GridList cellHeight="auto" className={classes.gridList} cols={1}>
        <GridListTile cols={1}>
          <Timetable />
        </GridListTile>
        <GridListTile cols={1}>
          <MealPlanner />
        </GridListTile>
        <GridListTile cols={1}>
          <Todo />
        </GridListTile>
      </GridList>
    );
  };

  const bottomSection = category.map((elem) => {
    const { id, text } = elem;
    const content = { text }.text;
    return (
      <GridListTile key={id} cols={1}>
        {id === 5 ? SpecialSection() : CrawlingSection(content)}
      </GridListTile>
    );
  });
  return (
    <GridList cellHeight={400} className={classes.gridList} cols={5}>
      {bottomSection}
    </GridList>
  );
}
