import React from 'react';
import {
  List, ListItem, Button, Drawer, Backdrop, Badge,
  Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent, Grid, LinearProgress,
} from '@material-ui/core';

import moment from 'moment';
import Carousel from 'react-material-ui-carousel';
import { SchoolClass } from '../shared/interfaces/timeTable.inteface';
import { TimeStringToStringArray, StringArrayToTime } from '../shared/utils/time-table.util';

export interface CardTimeLineProps {
  schoolClass: SchoolClass;
}

export default function CardTimeLine(props: CardTimeLineProps): JSX.Element {
  const { schoolClass } = props;
  const classTime = StringArrayToTime(TimeStringToStringArray(schoolClass.시간표))[0];
  const currTime = moment(`1997-06-07 ${moment(new Date()).format('HH:MM')}:00`).toDate();
  const state = { isCurrClass: false };

  if (classTime.startTime.getTime() < currTime.getTime()
   && currTime.getTime() < classTime.endTime.getTime()) {
    state.isCurrClass = true;
  }

  return (
    <Badge
      badgeContent="수업중"
      color="error"
      invisible={!state.isCurrClass}
      style={{ margin: 16 }}
    >
      <div
        style={{
          height: 80,
          width: 180,
          display: 'inline-flex',
          backgroundColor: schoolClass.color ? schoolClass.color : 'black',
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <Typography variant="body1" color="textPrimary" style={{ fontWeight: 'bold', padding: 16 }} align="center">
          {schoolClass.교과목명}
        </Typography>
      </div>
    </Badge>

  );
}
