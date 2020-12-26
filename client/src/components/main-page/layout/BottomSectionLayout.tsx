import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Tabs, Tab, Typography, Fade, Paper, Zoom, Grid,
} from '@material-ui/core';

import useAxios from 'axios-hooks';
import DashboardIcon from '@material-ui/icons/Dashboard';
import InfoIcon from '@material-ui/icons/Info';
import BottomSection from '../bottom-section/BottomSection';
import FreeBoardTable from '../free-board/FreeBoardTable';

import { FreeBoard } from '../shared/interfaces/freeBoard.interface';
import WordCloud from '../shared/utils/WordCloud';
import SpecialSection from '../bottom-section/special-section/SpecialSection';

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
        <Tab label={<DashboardIcon className={classes.tabTitle} />} />
        <Tab label={<InfoIcon className={classes.tabTitle} />} />
      </Tabs>

      <Grid container direction="row" xs={12}>
        <Grid item xs={10} style={{ height: 'auto' }}>
          {tabIndex === 0 && (
            <Fade in={tabIndex === 0} style={{ transitionDelay: '200ms' }}>
              <Paper elevation={0}>
                <BottomSection />
              </Paper>
            </Fade>
          )}
          {tabIndex === 1 && (
          <Fade in={tabIndex === 1} style={{ transitionDelay: '200ms' }}>
            <Paper elevation={0}>
              <FreeBoardTable />
            </Paper>
          </Fade>

          )}

        </Grid>

        <Grid item xs={2} style={{ height: 'auto' }}>
          <SpecialSection />
        </Grid>
      </Grid>

    </div>

  );
}
