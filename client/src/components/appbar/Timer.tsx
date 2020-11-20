import React from 'react';

// material-ui core components
import { Button, IconButton } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Modal from '@material-ui/core/Modal';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';

// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// countdown timer
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      position: 'absolute',
      width: 500,
      backgroundColor: 'white',
      borderRadius: '10px'
    },
    clock: {
      margin: 35
    },
    inputContainer: {
      display: 'flex',
      flexGrow: 0,
      marginBottom: 10,
      float: 'right'
    },
  }),
);

export default function Timer(): JSX.Element {

  const classes = useStyles();

  function getModalStyle() {
    const top = 10;
    const right = 5;

    return {
      top: `${top}%`,
      right: `${right}%`,
      transform: `translate(-${top}%, -${right}%)`,
    };
  }

  const remainTime = ({ remainingTime }: any) => { //남은 시간 출력
    currentTime = remainingTime
    const hours = Math.floor(remainingTime / 3600)
    const minutes = Math.floor((remainingTime % 3600) / 60)
    const seconds = remainingTime % 60
    let minutesStr: string = `${minutes}`;
    let secondsStr: string = `${seconds}`;
    if (minutes < 10) minutesStr = '0' + minutes;
    if (seconds < 10) secondsStr = '0' + seconds;
    let resultTime;
    if (hours === 0 && minutes === 0) resultTime = `${secondsStr}` //1분 미만이면 초만 출력
    else if (hours === 0) resultTime = `${minutesStr}:${secondsStr}` //1시간 미만이면 분:초 출력
    else resultTime = `${hours}:${minutesStr}` //1시간 이상이면 시:분 출력

    return resultTime
  }

  const [open, setOpen] = React.useState(false);
  let [settingTime, setSettingTime] = React.useState(0); //설정한 총 시간
  let [currentTime, setCurrentTime] = React.useState(0); //설정한 시간 중 남은 시간
  const [selectTime_minutes, setSelectTime_minutes] = React.useState(0); //설정할 시간 : 분
  const [modalStyle] = React.useState(getModalStyle); //팝업 스타일 지정

  const handleClickOpen = () => { //Timer를 클릭하면 실행되는 함수
    setCurrentTime(currentTime); //현재 남은 시간 저장
    setOpen(true); //팝업을 엶
  };
  const handleCancel = () => { //Dialog 바깥을 누르면 실행되는 함수
    setCurrentTime(currentTime); //현재 남은 시간 저장
    setOpen(false); //팝업을 닫음
  };
  const handleReset = () => { //Dialog에서 Reset 버튼을 누르면 실행되는 함수
    setSettingTime(0); //설정한 시간 초기화
    setCurrentTime(0); //현재 남은 시간 초기화
  };
  const handleSet = () => { //Dialog에서 Set 버튼을 누르면 실행되는 함수
    setOpen(false); //팝업을 닫음
    const selectTime = selectTime_minutes * 60; //입력받은 시간을 통해 Timer에 설정할 시간 계산
    setSettingTime(selectTime);
    setCurrentTime(selectTime);
  };
  const handleChangeMinutes = (event: React.ChangeEvent<{ value: unknown }>) => { //분을 설정하면 실행되는 함수
    setSelectTime_minutes(event.target.value as number);
    setCurrentTime(currentTime);
  };

  const CountdownTimer = (): JSX.Element => {
    return (
      <div>
        <IconButton //타이머 버튼
          style={{ backgroundColor: 'white', borderRadius: 30, height: 40, margin: 10 }}
          onClick={handleClickOpen}
          size="small"
        >
          <CountdownCircleTimer //타이머
            isPlaying//={isPlay}
            size={35}
            strokeWidth={2}
            duration={settingTime}
            initialRemainingTime={currentTime}
            trailColor={"#FFFFFF"}
            colors={"#FF0000"}
          >
            {remainTime}
            {/* {{({ remainingTime }) => remainingTime}} */}
          </CountdownCircleTimer>
        </IconButton>
        <Modal //팝업
          open={open}
          onClose={handleCancel}
        >
          <div style={modalStyle} className={classes.modal}>
            <IconButton onClick={handleReset} className={classes.clock}>
              <CountdownCircleTimer //타이머
                isPlaying
                size={400}
                strokeWidth={20}
                duration={settingTime}
                initialRemainingTime={currentTime}
                trailColor={"#FFFFFF"}
                colors={"#FF0000"}
              >
                {remainTime}
              </CountdownCircleTimer>
            </IconButton>

            <div className={classes.inputContainer}>
              <FormControl>
                <Input //입력창
                  id="input_minutes"
                  value={selectTime_minutes}
                  type="number"
                  onChange={handleChangeMinutes}
                  autoFocus={true}
                  endAdornment={<InputAdornment position="end">분</InputAdornment>}
                />
              </FormControl>
              <Button onClick={handleSet} color="primary" >
                Set
                </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <CountdownTimer />
  )
}