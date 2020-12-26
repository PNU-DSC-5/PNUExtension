import React from 'react';

// material-ui core components
import { Button, colors, IconButton } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Modal from '@material-ui/core/Modal';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';

// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// countdown timer
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const useStyles = makeStyles((theme: Theme) => createStyles({
  modal: {
    position: 'absolute',
    width: 500,
    backgroundColor: 'white',
    borderRadius: '10px',
  },
  clock: {
    margin: 35,
  },
  inputContainer: {
    display: 'flex',
    flexGrow: 0,
    marginBottom: 10,
    float: 'right',
  },
}));

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

  const remainTime = () => {
    // 남은 시간 출력
    const startTimeStr = localStorage.getItem('startTime');
    const settingTimeStr = localStorage.getItem('settingTime');
    if (startTimeStr && settingTimeStr) {
      const startTime = JSON.parse(startTimeStr);
      const settingTime = JSON.parse(settingTimeStr);

      const date = new Date();

      const remainingTime = (startTime + settingTime - date.getTime()) / 1000;

      const hours = Math.floor(remainingTime / 3600);
      const minutes = Math.floor((remainingTime % 3600) / 60);
      const seconds = Math.floor(remainingTime % 60);
      let minutesStr = `${minutes}`;
      let secondsStr = `${seconds}`;
      if (minutes < 10) minutesStr = `0${minutes}`;
      if (seconds < 10) secondsStr = `0${seconds}`;
      let resultTime;

      // 시간이 끝났을 때 0 출력
      if (remainingTime <= 0) return '0';
      // 1분 미만이면 ss만 출력
      if (hours === 0 && minutes === 0) resultTime = `${secondsStr}`;
      // 1시간 미만이면 mm:ss 출력
      else if (hours === 0) resultTime = `${minutesStr}:${secondsStr}`;
      // 1시간 이상이면 hh:mm 출력
      else resultTime = `${hours}:${minutesStr}`;

      return resultTime;
    }
  };

  const getSettingTime = () => {
    const dataString = localStorage.getItem('settingTime');
    if (dataString) {
      const settingTime = JSON.parse(dataString);
      return settingTime / 1000; // 총 설정한 시간 가져옴 : s 단위
    }
  };

  const getRemaingTime = () => {
    const startTimeStr = localStorage.getItem('startTime');
    const settingTimeStr = localStorage.getItem('settingTime');
    if (startTimeStr && settingTimeStr) {
      const startTime = JSON.parse(startTimeStr);
      const settingTime = JSON.parse(settingTimeStr);
      const date = new Date();

      const remainingTime = (startTime + settingTime - date.getTime()) / 1000;
      return remainingTime; // 남은 시간 가져옴 : s 단위
    }
  };

  const [open, setOpen] = React.useState(false);
  const [selectTime_minutes, setSelectTime_minutes] = React.useState(0); // 설정할 시간 : m 단위
  const [modalStyle] = React.useState(getModalStyle); // 팝업 스타일 지정

  const handleClickOpen = () => {
    // Timer를 클릭하면 실행되는 함수
    setOpen(true); // 팝업을 엶
  };
  const handleCancel = () => {
    // Dialog 바깥을 누르면 실행되는 함수
    setOpen(false); // 팝업을 닫음
  };
  const handleReset = () => {
    // Dialog에서 Reset 버튼을 누르면 실행되는 함수
    localStorage.setItem('startTime', JSON.stringify(0));
    localStorage.setItem('settingTime', JSON.stringify(0));
  };
  const handleSet = () => {
    // Dialog에서 Set 버튼을 누르면 실행되는 함수
    setOpen(false); // 팝업을 닫음
    const selectTime = selectTime_minutes * 60; // 입력받은 시간을 통해 Timer에 설정할 시간 계산

    const now = new Date();
    localStorage.setItem('startTime', JSON.stringify(now.getTime())); // set을 누른 시각 : ms 단위
    localStorage.setItem(
      'settingTime',
      JSON.stringify(selectTime_minutes * 60 * 1000),
    ); // 총 설정 시간 : ms 단위
  };

  const handleChangeMinutes = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    // 분을 설정하면 실행되는 함수
    setSelectTime_minutes(event.target.value as number);
  };

  const CountdownTimer = (): JSX.Element => (
    <div>
      <IconButton // 타이머 버튼
        style={{
          backgroundColor: 'white',
          borderRadius: 30,
          height: 32,
          margin: 12,
        }}
        onClick={handleClickOpen}
        size="small"
      >
        <CountdownCircleTimer // 타이머
          isPlaying //= {isPlay}
          size={28}
          strokeWidth={2}
          duration={getSettingTime()}
          initialRemainingTime={getRemaingTime()}
          trailColor="#FFFFFF"
          colors="#FF0000"
        >
<<<<<<< HEAD
          {remainTime}
          {/* {{({ remainingTime }) => remainingTime}} */}
        </CountdownCircleTimer>
      </IconButton>
      <Modal // 팝업
        open={open}
        onClose={handleCancel}
      >
        <div style={modalStyle} className={classes.modal}>
          <IconButton onClick={handleReset} className={classes.clock}>
            <CountdownCircleTimer // 타이머
              isPlaying
              size={400}
              strokeWidth={20}
              duration={getSettingTime()}
              initialRemainingTime={getRemaingTime()}
              trailColor="#FFFFFF"
              colors="#FF0000"
            >
              {remainTime}
            </CountdownCircleTimer>
          </IconButton>

          <div className={classes.inputContainer}>
            <FormControl>
              <Input // 입력창
                id="input_minutes"
                value={selectTime_minutes}
                type="number"
                onChange={handleChangeMinutes}
                autoFocus
                inputProps={{
                  style: {
                    color: 'black',
                    textAlign: 'center',
                  },
                }}
                endAdornment={
                  <InputAdornment position="end">분</InputAdornment>
=======
          <CountdownCircleTimer //타이머
            isPlaying //={isPlay}
            size={35}
            strokeWidth={2}
            duration={getSettingTime() || 1}
            initialRemainingTime={getRemaingTime()}
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
                duration={getSettingTime() || 1}
                initialRemainingTime={getRemaingTime()}
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
                  inputProps={{
                    style: {
                      color: "black",
                      textAlign: "center",
                    },
                  }}
                  endAdornment={
                    <InputAdornment position="end">분</InputAdornment>
>>>>>>> 0eb36e471af04d5acd7bdccf4591157036590237
                  }
              />
            </FormControl>
            <Button onClick={handleSet} color="primary">
              Set
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );

  return <CountdownTimer />;
}
