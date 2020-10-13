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

// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// axios
import useAxios from 'axios-hooks';

// context
import { useUser } from '../../utils/contexts/UserContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
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
    const userContext = useUser();
    const [loginedState, setLoginedState] = React.useState<undefined|'logined'|'static'>(undefined);
    
    React.useLayoutEffect(() => {
      setLoginedState(userContext.state);
      console.log(userContext.state);
    },[userContext.state])

    React.useEffect(() => {
      console.log(userContext.state)
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
            <AccountCircleIcon fontSize="large" color="secondary"/>
          </IconButton>
          <IconButton>
            <NotificationsIcon fontSize="large" color="secondary"/>
          </IconButton>
        </div>
      );
    }

    return(
        <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar style={{ justifyContent: 'space-between' }}>
                    <Typography variant="h5">
                        PNU Extension
                    </Typography>
                    {loginedState === 'logined' ? UserInterfaces() : LoginButton()}
                </Toolbar>
            </AppBar>
        </div>
    );
}