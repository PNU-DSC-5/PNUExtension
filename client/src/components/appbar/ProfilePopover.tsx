import React from 'react';

// material - ui core components
import {
  IconButton, ClickAwayListener, Grow , 
  Paper, Popper, MenuItem, MenuList, Avatar, 
} from '@material-ui/core';

// material - ui icons
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

// styles
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// contexts
import UserContext,{ UserInfo, defaultUser } from '../../utils/contexts/UserContext';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    paper: {
      marginRight: theme.spacing(2),

    },
    menuItem: {
      display: 'flex',
      flexGrow : 0,
      justifyContent: 'space-between',
      color: theme.palette.primary.main,
      '&:hover,select': {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
      },
    }
  }),
);

export default function ProfilePopover() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const userContext = React.useContext(UserContext);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const [profile, setProfile] = React.useState<UserInfo>(defaultUser);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  React.useEffect(() => {
    setProfile(userContext.user);
  }, [userContext]);

  const ProfileFace = React.useCallback((): JSX.Element => {
    if(profile.picture){
      return (
        <Avatar src={profile.picture}/>
      )
    }

    return (
      <AccountCircleIcon fontSize="large" color="secondary"/>
    )
  }, [profile.picture]);

  return (
    <div className={classes.root}>
        <IconButton
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          {ProfileFace()}
        </IconButton>
        <Popper 
          open={open} 
          anchorEl={anchorRef.current} 
          role={undefined} 
          transition 
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList 
                    autoFocusItem={open} 
                    id="menu-list-grow" 
                    onKeyDown={handleListKeyDown}
                    
                  >
                    <MenuItem onClick={handleClose} className={classes.menuItem}>
                      <SupervisedUserCircleIcon style={{marginRight: '15px'}}/>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleClose} className={classes.menuItem}>
                      <SettingsIcon />
                      Setting
                    </MenuItem>
                    <MenuItem onClick={userContext.handleLogout} className={classes.menuItem}>
                      <ExitToAppIcon />
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
    </div>
  );
}