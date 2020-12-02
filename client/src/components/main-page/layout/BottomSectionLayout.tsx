import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Tabs, Tab, Typography, Fade, Paper, Grow,
} from '@material-ui/core';

import BottomSection from '../bottom-section/BottomSection';
import FreeBoardTable from '../free-board/FreeBoardTable';
import {FreeBoard} from '../bottom-section/shared/interfaces/freeBoard.interface';

import useAxios from 'axios-hooks';

const useStyles = makeStyles((theme: Theme) => createStyles({
  rootPaper: {
    width: '100%',
    height: '100%',
  },
  tab: {
    marginBottom: theme.spacing(2),
  },
  tabTitle: {
    fontWeight: 'bold',
  },
}));

export default function BottomSectionLayout(): JSX.Element {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  const [{data: freeBoardData}] = useAxios<FreeBoard[]>({
    url: '/free-board',
    method: 'GET'
  },{manual: true})

  const handleTabChange = (event: any, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div style={{ width: '100%', minHeight: 1500 }}>
      <Tabs
        className={classes.tab}
        value={tabIndex}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleTabChange}
      >
        <Tab label={<Typography variant="body1" className={classes.tabTitle}>뉴스</Typography>} />
        <Tab label={<Typography variant="body1" className={classes.tabTitle}>게시판</Typography>} />
      </Tabs>

      {tabIndex === 0 ? (
        <Grow in={tabIndex === 0}>
          <Paper className={classes.rootPaper} elevation={0}>
            <BottomSection />
          </Paper>
        </Grow>
      ) : (
        <Fade in={tabIndex === 1}>
          <Paper className={classes.rootPaper} elevation={0}>
            {freeBoardData&& (
              <FreeBoardTable 
              freeBoardData={freeBoardData}
            />
            )}
          </Paper>
        </Fade>
      )}
    </div>

  );
}
