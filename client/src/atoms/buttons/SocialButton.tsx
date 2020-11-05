import React from 'react';

// material-ui core components
import { 
  Button, Grid, SvgIconProps, Typography
} from '@material-ui/core';

// styles
import { createStyles, makeStyles, Theme, fade  } from '@material-ui/core/styles';

// classnames
import classnames from 'classnames';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContents: {
      minWidth: '300px',
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
      marginBottom: '15px',
      
      // display: 'flex',
      // flexDirection: 'row',
      // justifyContent: 'center',
    },
    naver: {
      backgroundColor: "#37b24d",
    },
    google: {
      backgroundColor: '#ffff',
    },
    facebook: {
      backgroundColor: '#4267b2'
    },
    buttonIcon: {
      fontSize: '40px',
      marginRight: '10px',
      marginTop: '5px'
    }
  }),
);

interface SocialButtonProps {
  title: string;
  icons: (props?: SvgIconProps) => JSX.Element;
}

export default function SocialButton(props: SocialButtonProps): JSX.Element {
  const classes = useStyles();
  const { title, icons } = props;

  return(
    <Button 
      variant="contained"
      className={classnames([
      classes.buttonCommon, classes.google
      ])}
    >
      <Grid container alignItems="center" style={{ width : '100%', height: '100%' }}>

        <Grid item xs={6} style={{justifyContent: 'flex-end'}}>
            {icons()}
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6" color="primary" style={{textAlign: 'left'}}>
            {title}
          </Typography>
        </Grid>
      
      </Grid> 
    </Button>
  )
}