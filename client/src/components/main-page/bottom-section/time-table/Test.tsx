import React from 'react';
import {List, ListItem,Button} from '@material-ui/core';
import { makeStyles, createStyles, Theme ,fade} from '@material-ui/core/styles';

import moment from 'moment';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    }
  }),
);

interface TestProps {
  dummy: {
    연번: number;
    대학명: string;
    주관학과: number;
    주관학과명: string;
    학년: number;
    교과목코드: string;
    분반: string;
    교과목명: string;
    영문교과목명: string;
    교과구분: string;
    학점: number;
    이론: number;
    실습: number;
    교수명: string;
    제한인원: number;
    시간표: string;}[]
}

interface Block {
  isInclude: boolean;
  color: string;
}

const WEEK_SIZE = 6;
const TIME_SIZE = 52;

interface Week<T> {
  [key: string]: T; 
}

const week: Week<number> = {
  '월': 0, '화': 1, '수': 2, '목': 3, '금': 4, '토': 5,
}; 

export default function Test(props: TestProps): JSX.Element {
  const {dummy} = props;
  const classes = useStyles();
  const [schedule, setSchedule] = React.useState<Array<Array<Block>>>(
    ((new Array(WEEK_SIZE)).fill(new Array<Block>(TIME_SIZE).fill({isInclude: false, color: ''})))
  );

  const [userClassList, setUserClassList] = React.useState<(typeof dummy[0])[]>(dummy);
       
  const eachWeek = (week: Block[]):JSX.Element => (
      <div>
        {week.map((each, index) => {
        
          return (
          <ListItem
            button
            style={{
              height: '15px',
              width: '130px',
              borderTop: index %4 === 0 ? '1px solid black' : 'none',
              borderRight: '1px solid black',
              // borderLeft: 
              margin: 0,
              padding: 0,
              backgroundColor: each.isInclude? 'red' : 'gray'
            }}
          >
            
          </ListItem>)
        })}
      </div>
    )

  /**
   * json 시간 -> index
   * @param   inputTime 토 11:00(180)
   * @return  [5, 8, 20]
   */
  const timeFormmater = (inputTime: string) => {

    const splited = inputTime.split(',');
    const result: number[][] = [];

    splited.forEach((each) => {
    
      const time = moment('2020/10/10 '+each.slice(2,7)+':00'); 
      const startTime = (time.diff(moment('2020/10/10 09:00:00'),'minutes'))/15;
      const interval = each[11] === ')'? Number(each.slice(8,11))/15 : Number(each.slice(8,10))/15;

      result.push([
        week[each.slice(0,1)], startTime, Math.round(interval)
      ])
    })
    return result;
  }

  const handleSchedule = (inputTime: number[][],isRemove?: true) => {
    
    return new Promise((resolve) => {
      setSchedule(schedule.map((week,weekIndex) => {
        if(weekIndex === inputTime[0][0] || weekIndex === inputTime[1][0]){
          return week.map((day,index) => {
            if(inputTime[0][1] <= index && index <= inputTime[0][2]+inputTime[0][1]) {
              if(isRemove) return {isInclude: false, color: ''};
              else return {isInclude: true, color: ''};
            }
            else return day;
          })
        }
        else {
          if(weekIndex > inputTime[0][0]) resolve();
          return week;
        }
      }));
    })
   
  }

  async function processArray(userClassList: any[]) {
    userClassList.forEach(async (eachClass) => {
      const indexs = timeFormmater(eachClass['시간표']);
      if(indexs.length > 1) await handleSchedule([indexs[0],indexs[1]])
      else await handleSchedule([indexs[0],[-1]])
    })
  }

  React.useEffect(() => {
    // userClassList.forEach((eachClass) => {
    //   const indexs = timeFormmater(eachClass['시간표']);
    //   if(indexs.length > 1) handleSchedule([indexs[0],indexs[1]])
    //   else handleSchedule([indexs[0],[-1]])
    // }, Promise.resolve());
    processArray(userClassList);

  },[userClassList])

  const handleClassList = (newClass: typeof dummy[0], isRemove?: true) => {
    if(isRemove){
      setUserClassList(userClassList.filter((each) => each['연번'] !== newClass['연번']))
    }
    else{
      setUserClassList([...userClassList, newClass])
    }
  }

  return(
    <div className={classes.root}>
      
        {schedule.map((each) => {
            return (
              <List>
                {eachWeek(each)}
              </List>
            )
          })}
  
        <List>
          {dummy.map((each) => (
            <ListItem
              button
              onClick={() => {
                handleClassList(each);
                // const indexs = timeFormmater(each['시간표']);
                // if(indexs.length > 1) handleSchedule([indexs[0],indexs[1]])
                // else handleSchedule([indexs[0],[-1]])
              }}
            >
              {each['시간표']}
            </ListItem>
          ))}
        </List>
    </div>
  )
}