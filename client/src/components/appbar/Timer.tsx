import React from 'react';

// material-ui core components
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
//import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
//import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
//import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// styles
import { createStyles, makeStyles, Theme, fade  } from '@material-ui/core/styles';

// countdown timer
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },

  }),
);

export default function Timer(): JSX.Element {

    const classes = useStyles();

    const remainTime = ({ remainingTime } : any) => { //남은 시간 출력
        currentTime = remainingTime
        const hours = Math.floor(remainingTime / 3600)
        const minutes = Math.floor((remainingTime % 3600) / 60)
        const seconds = remainingTime % 60
        let minutesStr: string = `${minutes}`;
        let secondsStr: string = `${seconds}`;
        if (minutes < 10) minutesStr = '0' + minutes ;
        if (seconds < 10) secondsStr = '0' + seconds;
        let resultTime;
        if (hours === 0 && minutes === 0) resultTime = `${secondsStr}`
        else if (hours === 0) resultTime = `${minutesStr}:${secondsStr}`
        else resultTime = `${hours}:${minutesStr}`
      
        return resultTime
      }
    
      const [open, setOpen] = React.useState(false);
      let [settingTime, setSettingTime] = React.useState(0); //설정한 총 시간
      let [currentTime, setCurrentTime] = React.useState(0); //설정한 시간 중 남은 시간
      //const [isPlay, setIsPlay] = React.useState(false); //Timer가 실행 중인지
      const [selectTime_hours, setSelectTime_hours] = React.useState(0); //설정할 시간 : 시
      const [selectTime_minutes, setSelectTime_minutes] = React.useState(0); //설정할 시간 : 분
      const [selectTime_seconds, setSelectTime_seconds] = React.useState(0); //설정할 시간 : 초
    
      const handleClickOpen = () => { //Timer를 클릭하면 실행되는 함수
        setOpen(true); //Dialog를 엶
        setCurrentTime(currentTime); //현재 남은 시간 저장
      };
      const handleCancel = () => { //Dialog 바깥을 누르면 실행되는 함수
        setOpen(false); //Dialog를 닫음
        setCurrentTime(currentTime); //현재 남은 시간 저장
      };
      const handleReset = () => { //Dialog에서 Reset 버튼을 누르면 실행되는 함수
        setSettingTime(0); //설정한 시간 초기화
        setCurrentTime(0); //현재 남은 시간 초기화
      };
      const handleSet = () => { //Dialog에서 Set 버튼을 누르면 실행되는 함수
        setOpen(false); //Dialog를 닫음
        //setIsPlay(true); //Timer를 시작함
        const selectTime = selectTime_hours * 3600 + selectTime_minutes * 60 + selectTime_seconds; //입력받은 시간을 통해 Timer에 설정할 시간 계산
        setSettingTime(selectTime);
        setCurrentTime(selectTime);
      };
      const handleChangeHours = (event: React.ChangeEvent<{ value: unknown }>) => { //시를 설정하면 실행되는 함수
        setSelectTime_hours(event.target.value as number);
        setCurrentTime(currentTime);
      };
      const handleChangeMinutes = (event: React.ChangeEvent<{ value: unknown }>) => { //분을 설정하면 실행되는 함수
        setSelectTime_minutes(event.target.value as number);
        setCurrentTime(currentTime);
      };
      const handleChangeSeconds = (event: React.ChangeEvent<{ value: unknown }>) => { //초를 설정하면 실행되는 함수
        setSelectTime_seconds(event.target.value as number);
        setCurrentTime(currentTime);
      };
    
      const CountdownTimer = (): JSX.Element => {
        return(
          <div>
            <Button
              variant="contained"
              style={{backgroundColor: 'white', borderRadius: 50, width:50, height: 65}} 
              onClick={handleClickOpen}
            >
              <CountdownCircleTimer
                isPlaying//={isPlay}
                size={50}
                strokeWidth={5}
                duration={settingTime}
                initialRemainingTime={currentTime}
                trailColor={"#FFFFFF"}
                colors={"#FF0000"}
              >
                {remainTime}
                {/* {{({ remainingTime }) => remainingTime}} */}
              </CountdownCircleTimer>
            </Button>
            <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
              {/* {<DialogTitle id="form-dialog-title">시간을 설정해주세요</DialogTitle>} */}
              <DialogContent>
                <CountdownCircleTimer
                    isPlaying
                    size={400}
                    duration={settingTime}
                    initialRemainingTime={currentTime}
                    trailColor={"#FFFFFF"}
                    colors={"#FF0000"}
                >
                    {remainTime}
                    {/* {{({ remainingTime }) => remainingTime}} */}
                </CountdownCircleTimer>
                <FormControl className={classes.formControl}>
                <InputLabel id="hours_select_label">Hours</InputLabel>
                    <Select
                    labelId="hours_select_label"
                    id="hours_select"
                    value={selectTime_hours}
                    onChange={handleChangeHours}
                    >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={11}>11</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                <InputLabel id="minutes_select_label">Minutes</InputLabel>
                    <Select
                    labelId="minutes_select_label"
                    id="minutes_select"
                    value={selectTime_minutes}
                    onChange={handleChangeMinutes}
                    >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={59}>59</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                <InputLabel id="seconds_select_label">Seconds</InputLabel>
                    <Select
                    labelId="seconds_select_label"
                    id="seconds_select"
                    value={selectTime_seconds}
                    onChange={handleChangeSeconds}
                    >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={59}>59</MenuItem>
                    </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleReset} color="primary">
                  Reset
                </Button>
                <Button onClick={handleSet} color="primary">
                  Set
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }

    return (
        <CountdownTimer/>
    )
}