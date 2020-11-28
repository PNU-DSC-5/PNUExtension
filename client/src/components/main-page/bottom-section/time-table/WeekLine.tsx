import React from 'react';
import {
  List, ListItem, Button, Typography, Popper, DialogTitle, DialogContent,
} from '@material-ui/core';
import {
  makeStyles, createStyles, Theme, fade,
} from '@material-ui/core/styles';

import moment from 'moment';
import classname from 'classnames';

import Dialog from '@material-ui/core/Dialog';
import useBasicDialog from '../../../../utils/hooks/useBasicDialog';

import { SchoolClass } from '../shared/interfaces/timeTable.inteface';
import { TimeStringToStringArray } from '../shared/utils/time-table.util';

interface WeekTimeLineProps {
  schoolClasses: SchoolClass[];
  targetWeek: string;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  title: {
    marginBottom: '16px',
  },
  titleCurrWeek: {
    fontWeight: 'bold',
  },
  weekLineWrapper: {
    width: '14%',
    height: '780px',
  },
  '@keyframes blinker': {
    from: { opacity: 1 },
    to: { opacity: 0.8 },
  },
  blinkIcon: {
    animationName: '$blinker',
    animationDuration: '900ms',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
    animationTimingFunction: 'ease-in-out',
  },
  list: {
    border: `1px solid ${theme.palette.secondary.dark}`,
    height: 780,
    padding: 0,
    // borderRadius: 4,
    overflowY: 'hidden',
  },
  listCurrWeek: {
    border: `3px solid ${theme.palette.secondary.contrastText}`,
    // borderRadius: 4,
  },
  classItem: {
    color: 'white',
    position: 'absolute',
    // borderRadius: 4,
    boxShadow: theme.shadows[2],
    '&:hover,select': {
      // transform: 'scale3d(1.35, 1.05, 1)',
      boxShadow: theme.shadows[5],
      borderRadius: 4,
      animationName: '$blinker',
      animationDuration: '900ms',
      animationIterationCount: 'infinite',
      animationDirection: 'alternate',
      animationTimingFunction: 'ease-in-out',
    },
  },
  backgroundItem: {
    position: 'absolute',
    height: '60px',
    borderBottom: '1px solid gray',
  },
  dialogText: {
    marginBottom: theme.spacing(1) / 2,
  },
}));

export default function WeekLine(props: WeekTimeLineProps): JSX.Element {
  const classes = useStyles();
  const { schoolClasses, targetWeek } = props;
  const schoolTimes = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  const days = ['월', '화', '수', '목', '금', '토'];
  const isCurrWeek = days[moment().day() - 1] === targetWeek;

  const { open, handleClose, handleOpen } = useBasicDialog();
  const [clickedClass, setClickedClass] = React.useState<number>(0);

  return (
    <div className={classes.weekLineWrapper}>
      <Typography
        variant="h6"
        align="center"
        color="textSecondary"
        style={{
          fontWeight: 'bold',
        }}
        className={classname({
          [classes.title]: true,
          [classes.titleCurrWeek]: isCurrWeek,
        })}
      >
        {targetWeek}
      </Typography>

      <List className={classname({
        [classes.list]: true,
        [classes.listCurrWeek]: isCurrWeek,
        [classes.blinkIcon]: isCurrWeek,
      })}
      >
        {schoolTimes.map((each) => (
          <ListItem
            className={classes.backgroundItem}
            style={{ marginTop: (each - 9) * 60 }}
          />
        ))}

        {schoolClasses.map((eachClass, index) => {
          const pos = {
            height: 0,
            marginTop: 0,
          };

          const times = TimeStringToStringArray(eachClass['시간표']);

          const firstClass = times[0].split(' ');
          const secondClass = times[1].split(' ');

          if (firstClass[0] === targetWeek) {
            const time = moment(`2020/10/10 ${firstClass[1].slice(0, 5)}:00`);
            pos.height = firstClass[1][9] === ')' ? Number(firstClass[1].slice(6, 9)) : Number(firstClass[1].slice(6, 8));
            pos.marginTop = (time.diff(moment('2020/10/10 09:00:00'), 'minutes'));
          } else if (secondClass && secondClass[0] === targetWeek) {
            const time = moment(`2020/10/10 ${secondClass[1].slice(0, 5)}:00`);
            pos.height = secondClass[1][9] === ')' ? Number(secondClass[1].slice(6, 9)) : Number(secondClass[1].slice(6, 8));
            pos.marginTop = (time.diff(moment('2020/10/10 09:00:00'), 'minutes'));
          }

          return (
            <ListItem
              // className={classes.classItem}
              className={classname({
                [classes.classItem]: true,
                [classes.blinkIcon]: false,
              })}
              button
              style={{
                marginTop: pos.marginTop,
                height: pos.height,
                backgroundColor: eachClass.color ? eachClass.color : '#ffff',
              }}
              onClick={() => {
                handleOpen();
                setClickedClass(index);
              }}
            >
              <Typography variant="h6" align="left">
                {eachClass['교과목명'].length > 10 ? `${eachClass['교과목명'].slice(0, 11)}..` : eachClass['교과목명']}
              </Typography>
            </ListItem>
          );
        })}
      </List>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        scroll="paper"
        PaperProps={{
          style: {
            backgroundColor: fade('#ffff', 1),
            borderRadius: 16,
          },
        }}
      >
        <DialogContent
          style={{ padding: 32 }}
        >

          {schoolClasses[clickedClass] && (
          <div
            style={{
              margin: 4,
            }}
          >
            <Typography variant="h6" color="textSecondary" className={classes.dialogText}>
              {`${schoolClasses[clickedClass].교과목명}`}
            </Typography>

            <Typography variant="h6" color="textSecondary" className={classes.dialogText}>
              {`${schoolClasses[clickedClass].시간표}`}
            </Typography>

            <Typography variant="body1" color="textSecondary" className={classes.dialogText}>
              {`${schoolClasses[clickedClass].학년} 학년 ${schoolClasses[clickedClass].학점} 학점`}
            </Typography>

            <Typography variant="body1" color="textSecondary" className={classes.dialogText}>
              {`${schoolClasses[clickedClass].주관학과명}`}
            </Typography>
          </div>
          )}

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 8, marginRight: 8 }}
            onClick={() => {

            }}
          >
            <Typography variant="body1" color="textPrimary">
              삭제
            </Typography>
          </Button>

          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: 8 }}
            onClick={handleClose}
          >
            <Typography variant="body1" color="textSecondary">
              취소
            </Typography>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
