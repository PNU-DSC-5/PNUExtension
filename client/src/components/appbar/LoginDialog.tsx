import React from 'react';

// material-ui core components
import { 
  Dialog, 
  DialogContent, Typography ,AppBar, Toolbar, FormControlLabel,
  DialogTitle, Button, Grid, Switch
} from '@material-ui/core';

// custom icon
import GoogleIcon from '../../atoms/icons/GoogleIcon';
import FacebookIcon from '../../atoms/icons/FacebookIcon';
import GithubIcon from '../../atoms/icons/GithubIcon';

// styles
import { createStyles, makeStyles, Theme, fade ,withStyles } from '@material-ui/core/styles';

// classnames
import classnames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContents: {
      minWidth: '270px',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      padding: '25px',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: fade(theme.palette.primary.main, 0.1)
    },
    buttonCommon: {
      width: '100%',
      heigth: 'auto',
      marginBottom: '15px',
      padding: '0px'
    },
    github: {
      backgroundColor: "#9775fa",
    },
    google: {
      backgroundColor: '#ffff',
    },
    facebook: {
      backgroundColor: '#4267b2'
    },
    buttonIcon: {
      fontSize: '50px',
      marginRight: '10px',
      marginTop: '5px'
    },
    buttonText: {
      fontWeight: 'bold',
      textAlign: 'left'
    },
  })
);

interface DialogProps{
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
    "&$checked + $track": {
      color: "black",
      backgroundColor: "#69db7c",
      opacity: 1
    }
  },
  colorSecondary: {
    "&$checked": {
      color: "#2b8a3e",
    }
  },
  checked: {},
  disabled: {},
  track: {
    background: "#ff8787",
    opacity: 1,
  }
})(Switch);

export default function LoginDialog(props: DialogProps): JSX.Element {
  const { open, handleClose } = props;
  const classes = useStyles();

  const [autoLogin, setAutoLogin] = React.useState<boolean>(false);

  const handleAutoLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked)
    setAutoLogin(e.target.checked);
  }

  return(
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
    >
      <DialogTitle style={{ textAlign: 'center' }}>        
          <Typography variant="h4" color="primary"> 
            Login
          </Typography>
      </DialogTitle>

      <DialogContent 
        className={classes.dialogContents}
      >
        <Button 
          variant="contained"
          className={classnames([
            classes.buttonCommon, classes.google
          ])}
          href={'http://localhost:3000/users/login/google/:auto='+autoLogin}
        >
          <Grid container alignItems="center" style={{ width : '100%', height: '100%', padding: '-30px' }}>

            <Grid item xs={6} style={{ justifyContent: 'flex-end', padding: '-5px'}}>
              <GoogleIcon className={classes.buttonIcon}/>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h6" color="primary" className={classes.buttonText}>
                Google  
              </Typography>
            </Grid>
          </Grid>
             
        </Button>

        <Button 
          variant="contained"
          className={classnames([
            classes.buttonCommon, classes.github
          ])}
        >
          <Grid container alignItems="center" style={{ width : '100%', height: '100%' }}>

            <Grid item xs={6} style={{justifyContent: 'flex-end' , padding: '-5px'}}>
              <GithubIcon className={classes.buttonIcon}/>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h6" style={{color: 'white'}}  className={classes.buttonText}>
                Github  
              </Typography>
            </Grid>
          </Grid>
             
        </Button>

        <Button 
          variant="contained"
          className={classnames([
            classes.buttonCommon, classes.facebook
          ])}
        >
          <Grid container alignItems="center" style={{ width : '100%', height: '100%' }}>

            <Grid item xs={6} style={{justifyContent: 'flex-end'}}>
              <FacebookIcon className={classes.buttonIcon}/>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h6" style={{color: 'white'}} className={classes.buttonText}>
                Facebook  
              </Typography>
            </Grid>
          </Grid>
             
        </Button>

        <FormControlLabel
          control={
            <WithStyledSwitch 
              checked={autoLogin} 
              onChange={handleAutoLogin} 
              name="checked"
            />
          }
        
          label={
          (<Typography variant="body1">
            Auto Login
          </Typography>)}
          style={{ alignSelf: 'center', }}
        />

      </DialogContent>

    </Dialog>
  )
}