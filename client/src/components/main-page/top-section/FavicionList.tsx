import React from 'react';
import { Grid, Avatar, IconButton, Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles, fade } from '@material-ui/core/styles';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: fade(theme.palette.primary.light, 0.5),
      width: '696px',
      zIndex: 999,
      border: `2px solid ${fade(theme.palette.primary.light, 0.5)}`,
      borderRadius: 4
    },
    avatar: {
      margin: '16px',
      height: '40px',
      width: '40px',
      padding: '8px',
      boxShadow: theme.shadows[4],
      backgroundColor: fade(theme.palette.primary.light, 0.5),
    },
    avatarWrapper: {
      display: 'flex',
      flexDirection: 'column',
      '&:hover,select': {
        backgroundColor: fade(theme.palette.primary.light, 0.5),
        boxShadow: theme.shadows[0],
      },
    },
    iconButton: {
      width: '32px',
      color: theme.palette.primary.dark,
      justifySelf: 'flex-end'
    }
  }),
);

const dummy: any[] = [
  { url: 'www.naver.com', name: 'naver' },
  { url: 'www.google.com', name: 'google' },
  { url: 'www.github.com', name: 'github' },
  { url: 'www.kakao.com', name: 'kakao' },
  // { ':url': 'www.facebook.com' },
];

export default function FavicionList(): JSX.Element {
  const classes = useStyles();
  const defaultUrl = "https://icons.duckduckgo.com/ip3/";
  const [urlList, setUrlList] = React.useState<any[]>(dummy);

  const handleAddUrl = (url: string) => {
    setUrlList([...urlList, { url }])
  }

  React.useEffect(() => {
    console.log(urlList)
  }, [urlList])

  return (
    <Grid
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      {urlList.map((each) => (
        <Button className={classes.avatarWrapper}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Button
              className={classes.iconButton}
            >
              <MoreHorizIcon />
            </Button>

            <Button
              style={{
                padding: '4px',
              }}
            >
              <Avatar
                variant="rounded"
                className={classes.avatar}
              >
                <img height="100%" width="100%" src={defaultUrl + each.url + '.ico'} />
              </Avatar>
            </Button>
          </div>
        </Button>

      ))}

      <Button className={classes.avatarWrapper} style={{ alignItems: 'flex-end' }} onClick={() => handleAddUrl('www.facebook.com')}>
        <Button
          style={{
            padding: '4px',
            marginTop: '30px'
          }}
        >
          <Avatar
            variant="rounded"
            className={classes.avatar}
          >
            <AddIcon />
          </Avatar>
        </Button>


      </Button>

    </Grid>
  )
}