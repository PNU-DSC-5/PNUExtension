import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) => createStyles({
  section: {
    height: '100%',
    width: '100%',
    textAlign: 'center',
    background: theme.palette.primary.main,
  },
}));

export default function Todo(): JSX.Element {
  const classes = useStyles();
  return <Paper className={classes.section}>Todo</Paper>;
}
