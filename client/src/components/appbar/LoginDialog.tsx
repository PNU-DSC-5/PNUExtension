import React from 'react';

// material-ui core components
import {
  Dialog,
  DialogContent, Typography, AppBar, Toolbar, FormControlLabel,
  DialogTitle, Button, Grid, Switch, Avatar,
} from '@material-ui/core';

// custom icon
import {
  createStyles, makeStyles, Theme, fade, withStyles,
} from '@material-ui/core/styles';
import classnames from 'classnames';
import cookie from 'react-cookies';
import GoogleIcon from '../../atoms/icons/GoogleIcon';
import GithubIcon from '../../atoms/icons/GithubIcon';
import KakaoIcon from '../../atoms/icons/KakaoIcon';
import NaverIcon from '../../atoms/icons/NaverIcon';

// styles

// classnames

// cookie

const useStyles = makeStyles((theme: Theme) => createStyles({
  dialogContents: {
    minWidth: 'auto',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: fade(theme.palette.background.paper, 0.9),
    padding: theme.spacing(4),
    borderRadius: 16,
  },
  buttonCommon: {
    width: '200px',
    heigth: '62px',
    marginBottom: '15px',
    padding: 0,
    borderRadius: 32,
    margin: theme.spacing(2),
  },
  github: {
    backgroundColor: '#9775fa',
    '&:hover,select': {
      backgroundColor: '#9775fa',
      transform: 'scale3d(1.05, 1.05, 1)',
      boxShadow: theme.shadows[5],
    },
  },
  google: {
    backgroundColor: '#ffff',
    '&:hover,select': {
      transform: 'scale3d(1.05, 1.05, 1)',
      backgroundColor: '#ffff',
      boxShadow: theme.shadows[5],
    },
  },
  naver: {
    backgroundColor: '#2b8a3e',
    '&:hover,select': {
      transform: 'scale3d(1.05, 1.05, 1)',
      backgroundColor: '#2b8a3e',
      boxShadow: theme.shadows[5],
    },
  },
  kakao: {
    backgroundColor: '#ffd43b',
    '&:hover,select': {
      transform: 'scale3d(1.05, 1.05, 1)',
      boxShadow: theme.shadows[5],
      backgroundColor: '#ffd43b',
    },
  },
  buttonIcon: {
    fontSize: '50px',
    marginRight: theme.spacing(1),
    marginTop: '5px',
    marginLeft: theme.spacing(2),
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  switchLabel: {
    color: theme.palette.secondary.contrastText,
    fontWeight: 'bold',
  },
}));

interface DialogProps {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  defaultInfo?: any;
  request?: () => void;
  setChangeFlag?: any;
}

const WithStyledSwitch = withStyles({
  switchBase: {
    color: '#f03e3e',
    '&$checked + $track': {
      color: 'black',
      backgroundColor: '#69db7c',
      opacity: 1,
    },
  },
  colorSecondary: {
    '&$checked': {
      color: '#2b8a3e',
    },
  },
  checked: {},
  disabled: {},
  track: {
    background: '#ff8787',
    opacity: 1,
  },
})(Switch);

export default function LoginDialog(props: DialogProps): JSX.Element {
  const { open, handleClose } = props;
  const classes = useStyles();

  const [autoLogin, setAutoLogin] = React.useState<boolean>(false);

  const handleAutoLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoLogin(e.target.checked);
  };

  React.useEffect(() => {
    cookie.save('autoLogin', (() => {
      if (autoLogin) return 1;
      return 0;
    })(), {});
  }, [autoLogin]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        style: {
          // backgroundColor: fade('#495057', 0.8),
          borderRadius: 32,
        },
      }}
    >
      <DialogTitle style={{ textAlign: 'center', fontWeight: 900, marginTop: '16px' }}>
        <Typography variant="h4" className={classes.switchLabel}>
          Login
        </Typography>
      </DialogTitle>

      <DialogContent
        className={classes.dialogContents}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',

          }}
        >
          <Button
            variant="contained"
            className={classnames([
              classes.buttonCommon, classes.google,
            ])}
            href="http://localhost:3000/users/login/google"
          >
            <Grid container alignItems="center" style={{ width: '100%', height: '100%', padding: '-30px' }}>

              <Grid item xs={6} style={{ justifyContent: 'flex-end', padding: '-5px', textAlign: 'left' }}>
                <GoogleIcon className={classes.buttonIcon} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" color="textSecondary" className={classes.buttonText}>
                  Google
                </Typography>
              </Grid>
            </Grid>

          </Button>

          <Button
            variant="contained"
            className={classnames([
              classes.buttonCommon, classes.naver,
            ])}
            href="http://localhost:3000/users/login/naver"
          >
            <Grid container alignItems="center" style={{ width: '100%', height: '100%' }}>

              <Grid item xs={6} style={{ justifyContent: 'flex-end', textAlign: 'left' }}>
                <NaverIcon className={classes.buttonIcon} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" style={{ color: 'white' }} className={classes.buttonText}>
                  Naver
                </Typography>
              </Grid>
            </Grid>

          </Button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',

          }}
        >
          <Button
            variant="contained"
            className={classnames([
              classes.buttonCommon, classes.github,
            ])}
            href="http://localhost:3000/users/login/github"
          >
            <Grid container alignItems="center" style={{ width: '100%', height: '100%' }}>

              <Grid item xs={6} style={{ justifyContent: 'flex-end', padding: '-5px', textAlign: 'left' }}>
                <GithubIcon className={classes.buttonIcon} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" style={{ color: 'white' }} className={classes.buttonText}>
                  Github
                </Typography>
              </Grid>
            </Grid>

          </Button>

          <Button
            variant="contained"
            className={classnames([
              classes.buttonCommon, classes.kakao,
            ])}
            href="http://localhost:3000/users/login/kakao"
          >
            <Grid container alignItems="center" style={{ width: '100%', height: '100%' }}>

              <Grid item xs={6} style={{ justifyContent: 'flex-end', textAlign: 'left' }}>
                <KakaoIcon className={classes.buttonIcon} style={{ fontSize: '32px', marginLeft: '24px' }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" style={{ color: 'white' }} className={classes.buttonText}>
                  Kakao
                </Typography>
              </Grid>
            </Grid>

          </Button>
        </div>

        <FormControlLabel
          control={(
            <WithStyledSwitch
              checked={autoLogin}
              onChange={handleAutoLogin}
              name="checked"
            />
          )}
          label={(
            <Typography
              variant="body1"
              color="textSecondary"
              style={{ fontWeight: 'bold' }}
              className={classnames({
                [classes.switchLabel]: autoLogin,
              })}
            >
              Auto Login
            </Typography>
          )}
          style={{ alignSelf: 'center', marginTop: '16px' }}
        />

      </DialogContent>

    </Dialog>
  );
}
