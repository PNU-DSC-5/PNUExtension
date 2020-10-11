import React from 'react';
import { AppBar, Typography, Toolbar, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';

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
  }),
);

export function LayoutAppBar(): JSX.Element {
    const classes = useStyles();

    const [{ 
        data: testData, 
        error: testError, 
        loading: testLoading }, 
        excuteTest] = useAxios({
        url: 'http://localhost:3000/users/login/test',
    }, { manual: true });

    const handleTest = () => {
      excuteTest()
          .then((res) => {
           
          })
          .catch((err) => console.log(
            'ㅜㅜㅜ', err
          ));
    }

    return(
        <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar style={{ justifyContent: 'space-between' }}>
                    <Typography variant="h5">
                        PNU Extension
                    </Typography>
                    <Button
                      onClick={handleTest}
                      variant="contained"
                      color="secondary"
                    >
                      <Typography>
                        Axios Test
                      </Typography>
                    </Button>
                    <Button 
                        href="http://localhost:3000/users/login/google"
                        variant="contained"
                        color="secondary"
                    >
                        <Typography style={{fontWeight: 'bold'}}>
                          Login
                        </Typography>
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}

