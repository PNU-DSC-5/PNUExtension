import React from 'react';

// material-ui core components
import { 
  AppBar, Typography, Toolbar, Button,
  IconButton, 
} from '@material-ui/core';

// material-ui icons
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import TimerIcon from '@material-ui/icons/Timer';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
//import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// styles
import { createStyles, makeStyles, Theme, fade  } from '@material-ui/core/styles';

// axios
import useAxios from 'axios-hooks';

// context
import UserContext from '../../utils/contexts/UserContext';

// sub component
import ProfilePopover from './ProfilePopover';

// countdown timer
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      backgroundColor: fade(theme.palette.primary.main, 0.5)
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    userInterfaceContainer: {
      marginRight: '0px',
      display: 'flex',
      flexGrow: 0,
      paddingLeft: '10px'
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },

  }),
);

/********************************************************
  페이지 레이아웃 최상단에 고정 위치하는 앱 바

  1. 로고 및 타이틀
  2. 로직
    로그인 시 -> 알림 , 타이머 , 프로필
    비로그인시 -> 로그인 버튼
*********************************************************/

export function LayoutAppBar(): JSX.Element {
    const classes = useStyles();
    const userContext = React.useContext(UserContext);

    React.useLayoutEffect(() => {
    },[userContext])
    
    const LoginButton = (): JSX.Element => {
      return (
        <Button 
          href="http://localhost:3000/users/login/google"
          variant="contained"
          color="secondary"
        >
          <Typography style={{fontWeight: 'bold'}}>
              Login
          </Typography>
        </Button>
      );
    };

    const UserInterfaces = (): JSX.Element => {
      return(
        <div className={classes.userInterfaceContainer}>
          <IconButton>
            <TimerIcon fontSize="large" color="secondary"/>
          </IconButton>
          <IconButton>
            <NotificationsIcon fontSize="large" color="secondary"/>
          </IconButton>
          <ProfilePopover />
        </div>
      );
    }

    const remainTime = ({ remainingTime } : any) => {
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
    let [settingTime, setSettingTime] = React.useState(0);
    let [currentTime, setCurrentTime] = React.useState(0);
    const [isPlay, setIsPlay] = React.useState(false);
    const [selectTime_hours, setSelectTime_hours] = React.useState(0);
    const [selectTime_minutes, setSelectTime_minutes] = React.useState(0);
    const [selectTime_seconds, setSelectTime_seconds] = React.useState(0);
    //let currentTime = 0;

    const handleClickOpen = () => {
      setOpen(true);
      setCurrentTime(currentTime);
    };
    const handleCancel = () => {
      setOpen(false);
      setCurrentTime(currentTime);
    };
    const handleReset = () => {
      setSettingTime(0);
      setCurrentTime(0);
    };
    const handleSet = () => {
      setOpen(false);
      setIsPlay(true);
      const selectTime = selectTime_hours * 3600 + selectTime_minutes * 60 + selectTime_seconds;
      setSettingTime(selectTime);
      setCurrentTime(selectTime);
    };
    const handleChangeHours = (event: React.ChangeEvent<{ value: unknown }>) => {
      //setSettingTime(event.target.value as number);
      setSelectTime_hours(event.target.value as number);
      setCurrentTime(currentTime);
    };
    const handleChangeMinutes = (event: React.ChangeEvent<{ value: unknown }>) => {
      //setSettingTime(event.target.value as number);
      setSelectTime_minutes(event.target.value as number);
      setCurrentTime(currentTime);
    };
    const handleChangeSeconds = (event: React.ChangeEvent<{ value: unknown }>) => {
      //setSettingTime(event.target.value as number);
      setSelectTime_seconds(event.target.value as number);
      setCurrentTime(currentTime);
    };

    const CountdownTimer = (): JSX.Element => {
      return(
        <div>
          <Button
            variant="contained"
            style={{backgroundColor: 'white', borderRadius: 50, width:50, height: 60}} 
            onClick={handleClickOpen}
          >
            <CountdownCircleTimer 
              isPlaying={isPlay}
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
              </Select>
            </FormControl>
              {/* {<TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
              />} */}
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

    return(
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar style={{ justifyContent: 'space-between'}}>
                    <Typography variant="h5">
                        PNU Extension
                    </Typography>
                    <CountdownTimer/>
                    {userContext.state === 'logined' ? UserInterfaces() : LoginButton()}
                </Toolbar>
            </AppBar>
        </div>
    );
}