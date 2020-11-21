import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      height: '100%',
      width: '100%',
      textAlign: 'center',
    },
  }),
);

export default function MealPlanner(): JSX.Element {
  const classes = useStyles();
  return <Paper className={classes.section}>MealPlanner</Paper>;
}