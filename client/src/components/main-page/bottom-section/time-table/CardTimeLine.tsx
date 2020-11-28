import React from 'react';
import {
  List, ListItem, Button, Drawer, Backdrop,
  Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent, Grid, LinearProgress,
} from '@material-ui/core';

import moment from 'moment';
import Carousel from 'react-material-ui-carousel';
import { SchoolClass } from '../shared/interfaces/timeTable.inteface';

export interface CardTimeLineProps {
  schoolClass: SchoolClass;
}

export default function CardTimeLine(props: CardTimeLineProps): JSX.Element {
  const { schoolClass } = props;

  return (
    <div
      style={{
        height: '100px',
        backgroundColor: schoolClass.color ? schoolClass.color : '#ffff',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
        marginRight: 16,
        color: 'white',
      }}
    >
      {schoolClass.교과목명}
    </div>
  );
}
