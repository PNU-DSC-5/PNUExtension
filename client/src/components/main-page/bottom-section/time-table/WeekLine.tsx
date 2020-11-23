import React from 'react';
import { List, ListItem, Button, Typography } from '@material-ui/core';
import { makeStyles, createStyles, Theme, fade } from '@material-ui/core/styles';

import moment from 'moment';
import { SchoolClass } from '../shared/interfaces/timeTable.inteface';

interface WeekTimeLineProps {
  schoolClasses: SchoolClass[];
  targetWeek: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    title: {
      marginBottom: '16px'
    },
    weekLineWrapper: {
      width: '10%',
      height: '780px',
      marginRight: '4px',
    },
    list: {
      border: '1px solid gray',
      height: 780,
      padding: 0,
      borderRadius: 4
    },
    classItem: {
      backgroundColor: '#74c0fc',
      color: 'white',
      position: 'absolute',
      borderRadius: 4,
      boxShadow: theme.shadows[2]
    },
    backgroundItem: {
      position: 'absolute',
      height: '60px',
      borderBottom: '1px solid gray',
    }
  }),
);

function splitTimeString(str: string) {
  const result = str.split(',');
  if (result.length > 1)
    return result;
  result.push('일');
  // console.log(result)
  return result;
}

export default function WeekLine(props: WeekTimeLineProps): JSX.Element {
  const classes = useStyles();
  const { schoolClasses, targetWeek } = props;
  const schoolTimes = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  return (
    <div className={classes.weekLineWrapper}>
      <Typography variant="h6" align="center" className={classes.title}>
        {targetWeek}
      </Typography>

      <List className={classes.list}>
        {schoolTimes.map((each) => {
          return (
            <ListItem
              className={classes.backgroundItem}
              style={{ marginTop: (each - 9) * 60, }}
            >
            </ListItem>
          )
        })}

        {schoolClasses.map((eachClass) => {
          const pos = {
            height: 0,
            marginTop: 0,
          }

          const times = splitTimeString(eachClass['시간표']);
          const firstClass = times[0].split(' ');
          const secondClass = times[1].split(' ');

          if (firstClass[0] === targetWeek) {
            const time = moment('2020/10/10 ' + firstClass[1].slice(0, 5) + ':00');
            pos.height = firstClass[2][4] === ')' ? Number(firstClass[2].slice(1, 4)) : Number(firstClass[2].slice(1, 3));
            pos.marginTop = (time.diff(moment('2020/10/10 09:00:00'), 'minutes'))

          } else if (secondClass[0] === targetWeek) {
            const time = moment('2020/10/10 ' + secondClass[1].slice(0, 5) + ':00');
            pos.height = secondClass[2][4] === ')' ? Number(secondClass[2].slice(1, 4)) : Number(secondClass[2].slice(1, 3));
            pos.marginTop = (time.diff(moment('2020/10/10 09:00:00'), 'minutes'))
          }

          return (
            <ListItem
              button
              className={classes.classItem}
              style={{
                marginTop: pos.marginTop,
                height: pos.height,
              }}
            >
              {eachClass['교과목명']}
            </ListItem>
          )
        })}
      </List>
    </div>

  )
}