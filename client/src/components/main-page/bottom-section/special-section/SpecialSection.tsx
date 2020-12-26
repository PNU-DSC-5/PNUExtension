import React from 'react';
import {
  GridListTile, GridList,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import WeekTable from '../time-table/WeekTable';
import MealPlanner from '../meal-planner/MealPlanner';
import Todo from '../to-do/Todo';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    // display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    // backgroundColor: theme.palette.background.paper,
    position: 'fixed',
    marginTop: 32,
    marginRight: 16,
  },
  gridList: {
    width: '100%',
  },
  specialTile: {
    // '&:hover,select': {
    //   // backgroundColor: '#9775fa',
    //   // transform: 'scale3d(1.05, 1.05, 1)',
    //   boxShadow: theme.shadows[10],
    // },
  },
}));

export default function SpecialSection(): JSX.Element {
  const classes = useStyles();
  return (
    <GridListTile cols={1} className={classes.root}>
      <GridList
        cellHeight={148}
        className={classes.gridList}
        cols={1}
        spacing={5}
        style={
        {
          // width: '300px',
          // position: 'fixed',
        }
      }
      >
        <GridListTile cols={1} className={classes.specialTile}>
          <WeekTable />
        </GridListTile>
        <GridListTile cols={1}>
          <MealPlanner />
        </GridListTile>
        <GridListTile cols={1}>
          <Todo />
        </GridListTile>
      </GridList>
    </GridListTile>
  );
}
