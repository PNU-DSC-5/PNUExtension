import React from 'react';
import {
  Grid, Avatar, IconButton, Button,
  Menu, Popper, ClickAwayListener,
  MenuItem, MenuProps,
  ListItemIcon, Typography, TextField,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles, fade, withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import useAnchorEl from '../../../utils/hooks/useAnchorEl';
import useEventTargetValue from '../../../utils/hooks/useEventTargetValue'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: fade(theme.palette.primary.light, 0.5),
      width: '696px',
      zIndex: 999,
      border: `2px solid ${fade(theme.palette.primary.light, 0.5)}`,
      borderRadius: 4
    },
    avatar: (props: { dragActive: boolean }) => ({
      margin: '16px',
      height: '40px',
      width: '40px',
      padding: '8px',
      boxShadow: theme.shadows[4],
      backgroundColor: fade(theme.palette.primary.light, 0.5),
    }),
    avatarWrapper: {
      display: 'flex',
      flexDirection: 'column',
      '&:hover,select': {
        backgroundColor: fade(theme.palette.primary.light, 0.5),
        boxShadow: theme.shadows[0],
        "& $addIcon": {
          color: "purple"
        }
      },

    },
    iconButton: {
      width: '32px',
      color: theme.palette.primary.dark,
      justifySelf: 'flex-end'
    },
    listPaper: {
      backgroundColor: fade(theme.palette.primary.light, 0.5),
    },
    popperRoot: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: theme.palette.primary.light,
      // padding: `0 ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(2)}`,
      border: `2px solid ${theme.palette.primary.light}`,
      borderRadius: 4,
      zIndex: 999,
      padding: '0 16px 16px 16px'
    },
    popperBox: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
  }),
);

const StyledMenu = withStyles({
  paper: {
    backgroundColor: fade('#adb5bd', 0.9),
  }
})((props: MenuProps) => (
  <Menu
    elevation={1}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const dummy: any[] = [
  { url: 'www.naver.com', name: 'naver' },
  { url: 'www.google.com', name: 'google' },
  { url: 'www.github.com', name: 'github' },
  { url: 'www.kakao.com', name: 'kakao' },
];

export default function FavicionList(): JSX.Element {
  const classes = useStyles({ dragActive: false });
  const defaultUrl = "https://icons.duckduckgo.com/ip3/";
  const [selectedUrlIndex, setSelectedUrlIndex] = React.useState<number>(0);
  const [urlList, setUrlList] = React.useState<any[]>(dummy);

  const menuAnchorEl = useAnchorEl();
  const addAnchorEl = useAnchorEl();

  const urlInput = useEventTargetValue();
  const nameInput = useEventTargetValue();

  const handleAddUrl = (url: string, name: string) => {
    setUrlList([...urlList, { url, name }])
  }

  return (
    // <ClickAwayListener onClickAway={addAnchorEl.handleAnchorClose}>
    <Grid
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      {urlList.map((each, index) => (
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
              onClick={(e) => {
                menuAnchorEl.handleAnchorOpen(e);
                setSelectedUrlIndex(index);
              }}
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

      ))
      }

      <Button
        className={classes.avatarWrapper}
        style={{
          alignItems: 'flex-end', padding: '4px',
          marginTop: '30px'
        }}
        onClick={(e) => { addAnchorEl.handleAnchorOpen(e); }}
      >

        <Avatar
          variant="rounded"
          className={classes.avatar}
        >
          <AddIcon />
        </Avatar>

      </Button>

      <StyledMenu
        anchorEl={menuAnchorEl.anchorEl}
        open={menuAnchorEl.open}
        onClose={menuAnchorEl.handleAnchorClose}
      >
        <MenuItem
          dense
          button
          onClick={() => {

          }}
        >
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <Typography variant="body1">
            변경
          </Typography>
        </MenuItem>
        <MenuItem
          dense
          button
          onClick={() => {
            setUrlList(urlList.filter((each) => each.name !== urlList[selectedUrlIndex].name));
            menuAnchorEl.handleAnchorClose();
          }}
        >
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <Typography variant="body1">
            제거
          </Typography>
        </MenuItem>
      </StyledMenu>


      <Popper
        className={classes.popperRoot}
        placement="bottom-start"
        anchorEl={addAnchorEl.anchorEl}
        open={addAnchorEl.open}
        disablePortal
        modifiers={{
          flip: { enabled: false },
          preventOverflow: { enabled: false, boundariesElement: 'scrollParent' },
          hide: { enabled: false },
        }}
      >

        <IconButton
          style={{ alignSelf: 'flex-end' }}
          onClick={addAnchorEl.handleAnchorClose}
        >
          <CloseIcon />
        </IconButton>

        <TextField
          variant="outlined"
          label="URL"
          value={urlInput.value}
          onChange={urlInput.handleChange}
        // style={{
        //   marginTop: '16px'
        // }}
        />

        <TextField
          variant="outlined"
          label="Name"
          value={nameInput.value}
          onChange={nameInput.handleChange}
          style={{
            marginTop: '16px'
          }}
        />

        <Button
          variant="contained"
          color="primary"
          style={{
            marginTop: '16px'
          }}
          onClick={() => handleAddUrl(urlInput.value, nameInput.value)}
        >
          추가하기
        </Button>

      </Popper>

    </Grid >
    //* </ClickAwayListener> */ }
  )
}