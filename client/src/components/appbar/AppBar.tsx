import React from "react";

// material-ui core components
import {
  AppBar,
  Typography,
  Toolbar,
  Button,
  IconButton,
} from "@material-ui/core";

// material-ui icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import TimerIcon from "@material-ui/icons/Timer";
import NotificationsIcon from "@material-ui/icons/Notifications";

// styles
import {
  createStyles,
  makeStyles,
  Theme,
  fade,
} from "@material-ui/core/styles";

// axios
import useAxios from "axios-hooks";

// context
import UserContext from "../../utils/contexts/UserContext";

// sub component
import ProfilePopover from "./ProfilePopover";
import LoginDialog from "./LoginDialog";
import NotificationPopper from "./NotificationPopper";

// hooks
import useBasicDialog from "../../utils/hooks/useBasicDialog";
import useAnchorEl from "../../utils/hooks/useAnchorEl";

// Timer
import Timer from "./Timer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: "auto",
    },
    appBar: {
      backgroundColor: fade(theme.palette.primary.main, 0.8),
    },
    loginButton: {
      "&:hover,select": {
        transform: "scale3d(1.15, 1.15, 1)",
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    userInterfaceContainer: {
      marginRight: "0px",
      display: "flex",
      flexGrow: 0,
      paddingLeft: "10px",
    },
  })
);

/** ******************************************************
  페이지 레이아웃 최상단에 고정 위치하는 앱 바

  1. 로고 및 타이틀
  2. 로직
    로그인 시 -> 알림 , 타이머 , 프로필
    비로그인시 -> 로그인 버튼
******************************************************** */

export function LayoutAppBar(): JSX.Element {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const dialog = useBasicDialog();
  const popper = useAnchorEl();

  React.useLayoutEffect(() => {}, [userContext]);

  const LoginButton = (): JSX.Element => (
    <Button
      variant="outlined"
      color="secondary"
      className={classes.loginButton}
      onClick={() => dialog.handleOpen()}
    >
      <Typography style={{ fontWeight: "bold" }}>Login</Typography>
    </Button>
  );

  const UserInterfaces = (): JSX.Element => (
    <div className={classes.userInterfaceContainer}>
      <Timer />
      <IconButton onClick={(e) => popper.handleAnchorOpen(e)}>
        <NotificationsIcon fontSize="large" color="secondary" />
      </IconButton>
      <ProfilePopover />
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="h6">PNU Extension</Typography>
          {userContext.state === "logined" ? UserInterfaces() : LoginButton()}
        </Toolbar>
      </AppBar>

      <LoginDialog
        open={dialog.open}
        handleOpen={dialog.handleOpen}
        handleClose={dialog.handleClose}
      />

      {popper.anchorEl && popper.open && (
        <NotificationPopper
          open={popper.open}
          anchorEl={popper.anchorEl}
          handleClose={popper.handleAnchorClose}
        />
      )}
    </div>
  );
}
