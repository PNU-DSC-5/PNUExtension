import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Tabs, Tab, Typography, Fade, Paper, Zoom,
} from '@material-ui/core';

import useAxios from 'axios-hooks';
import BottomSection from '../bottom-section/BottomSection';
import FreeBoardTable from '../free-board/FreeBoardTable';
import { FreeBoard } from '../shared/interfaces/freeBoard.interface';
import WordCloud from '../shared/utils/WordCloud';

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

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
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

      {tabIndex === 0 && (
        <Fade in={tabIndex === 0} style={{ transitionDelay: '200ms' }}>
          <Paper className={classes.rootPaper} elevation={0}>
            <BottomSection />
          </Paper>
        </Fade>
      )}

      {tabIndex === 1 && (
        <Fade in={tabIndex === 1} style={{ transitionDelay: '200ms' }}>
          <Paper className={classes.rootPaper} elevation={0}>
            {/* {freeBoardData && ( */}
            <div>
              <FreeBoardTable />

              <div style={{ marginTop: 32 }}>
                <WordCloud />
              </div>
            </div>

            {/* )} */}
          </Paper>
        </Fade>
      )}
    </div>

  );
}
