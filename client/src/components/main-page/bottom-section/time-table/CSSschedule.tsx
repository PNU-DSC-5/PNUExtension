import React from 'react';
import {List, ListItem,Button} from '@material-ui/core';
import { makeStyles, createStyles, Theme ,fade} from '@material-ui/core/styles';

import moment from 'moment';

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
    시간표: string;
  }[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    }
  }),
);

function splitTimeString(str: string){
  const result = str.split(',');
  if(result.length > 1)
    return result;
  result.push('일');
  return result;
}

export default function Ctest(props: TestProps):JSX.Element {
  const {dummy} = props;

  const [mon, setMon] = React.useState<typeof dummy>(dummy.filter((each) => splitTimeString(each['시간표'])[0][0] === '월' || splitTimeString(each['시간표'])[1][0] === '월'));
  const [tue, setTue] = React.useState<typeof dummy>(dummy.filter((each) => splitTimeString(each['시간표'])[0][0] === '화' || splitTimeString(each['시간표'])[1][0] === '화'));
  const [wen, setWen] = React.useState<typeof dummy>(dummy.filter((each) => splitTimeString(each['시간표'])[0][0] === '수' || splitTimeString(each['시간표'])[1][0] === '수'));
  const [thu, setThu] = React.useState<typeof dummy>(dummy.filter((each) => splitTimeString(each['시간표'])[0][0] === '목' || splitTimeString(each['시간표'])[1][0] === '목'));
  const [fri, setFri] = React.useState<typeof dummy>(dummy.filter((each) => splitTimeString(each['시간표'])[0][0] === '금' || splitTimeString(each['시간표'])[1][0] === '금'));
  const [sat, setSat] = React.useState<typeof dummy>(dummy.filter((each) => splitTimeString(each['시간표'])[0][0] === '토' || splitTimeString(each['시간표'])[1][0] === '토'));

  function WeekTimeLine(data: typeof dummy): JSX.Element {

    console.log(data);
    return(
      <List>
        {data.map((eachClass) => {
          const pos = {
            height: 0,
            marginTop: 0,
          }
          
          const times = eachClass['시간표'].split(',');
          if(times[0][0] === '월'){
            const time = moment('2020/10/10 '+times[0][1].slice(0,5)+':00'); 
            pos.height = times[0][2][4] === ')' ? Number(times[0][2].slice(1,4)) : Number(times[0][2].slice(1,3));
            pos.marginTop = (time.diff(moment('2020/10/10 09:00:00'),'minutes'))
          } else if(times[1][0] === '월'){
            const time = moment('2020/10/10 '+times[1][1].slice(0,5)+':00'); 
            pos.height = times[1][2][4] === ')' ? Number(times[1][2].slice(1,4)) : Number(times[1][2].slice(1,3));
            pos.marginTop = (time.diff(moment('2020/10/10 09:00:00'),'minutes'))
          }

          console.log('result\n',pos)

          return (
          <ListItem
              button
              style={{
                backgroundColor: 'green',
                color: 'white',
                position: 'absolute',
                marginTop: pos.marginTop,
                height: pos.height
              }}
            >
            {eachClass['시간표']}
          </ListItem>
          )
        })}
      </List>
    )
  }

  return(
    <div
      style={{
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <div
        style={{
          width: '15%',
          marginRight: '8px'
        }}
      >
       {WeekTimeLine(mon)}
      </div>
      
      <div
        style={{
          width: '15%',
          marginRight: '8px'
        }}
      >
       {WeekTimeLine(tue)}
      </div>

      <div
        style={{
          width: '15%',
          marginRight: '8px'
        }}
      >
       {WeekTimeLine(wen)}
      </div>

      <div
        style={{
          width: '15%',
          marginRight: '8px'
        }}
      >
       {WeekTimeLine(thu)}
      </div>

      <div
        style={{
          width: '15%',
          marginRight: '8px'
        }}
      >
       {WeekTimeLine(fri)}
      </div>

      <div
        style={{
          width: '15%',
          marginRight: '8px'
        }}
      >
       {WeekTimeLine(sat)}
      </div>
    </div>
  )
}