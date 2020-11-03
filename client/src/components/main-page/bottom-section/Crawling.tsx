import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      height: '100%',
      width: '100%',
      textAlign: 'center',
      margin: 15,
    },
  }),
);

interface Props {
  content: string;
}

const Crawling = ({ content }: Props) => {
  const classes = useStyles();
  return <Paper className={classes.section}>{content}</Paper>;
};

export default Crawling;
