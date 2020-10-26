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
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';

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
    }
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
      const hours = Math.floor(remainingTime / 3600)
      const minutes = Math.floor((remainingTime % 3600) / 60)
      const seconds = remainingTime % 60
      let time;
      if (hours === 0 && minutes === 0) time = `${seconds}`
      else if (hours === 0) time = `${minutes}:${seconds}`
      else time = `${hours}:${minutes}`
    
      return time
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
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
              isPlaying
              size={50}
              duration={10}
              //initialRemainingTime={5}
              trailColor={"#FFFFFF"}
              colors={"#FF0000"}
            >
              {remainTime}
              {/* {{({ remainingTime }) => remainingTime}} */}
            </CountdownCircleTimer>
          </Button>
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">시간을 설정해주세요(미완성)</DialogTitle>
            <DialogContent>
            <CountdownCircleTimer
              isPlaying
              size={50}
              duration={10}
              //initialRemainingTime={5}
              trailColor={"#FFFFFF"}
              colors={"#FF0000"}
            >
              {remainTime}
              {/* {{({ remainingTime }) => remainingTime}} */}
            </CountdownCircleTimer>
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
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleClose} color="primary">
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