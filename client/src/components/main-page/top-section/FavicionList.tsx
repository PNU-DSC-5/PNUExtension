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

import UserContext from '../../../utils/contexts/UserContext';
import { Url } from '../../../shared/interfaces/user.interface';

import useAxios from 'axios-hooks';
import userEvent from '@testing-library/user-event';

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
      border: `2px solid ${theme.palette.primary.light}`,
      borderRadius: 10,
      zIndex: 999,
      padding: '0 16px 16px 16px',
      boxShadow: theme.shadows[4],
    },
    popperBox: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    textField: {
      '& label.Mui-focused': {
        color: 'green',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
      },
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
          borderColor: 'green',
        },
      },
    }
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


export default function FavicionList(): JSX.Element {
  const classes = useStyles();
  const defaultUrl = "https://icons.duckduckgo.com/ip3/";
  const userContext = React.useContext(UserContext);

  const [, postUrlRequest] = useAxios<any>({
    url: 'http://localhost:3000/url',
    method: 'post'
  }, { manual: true });

  const [{ data: urlsData, error: urlError, loading: urlLoading }, getUrlRequest] = useAxios<Url[]>({
    url: 'http://localhost:3000/url',
    method: 'get'
  }, { manual: true });

  const [, deleteUrlRequest] = useAxios<any>({
    url: 'http://localhost:3000/url',
    method: 'delete'
  }, { manual: true });

  /**
   * url 리스트 초기값은 userContext 에서 가져오며
   * 해당 userContext 에 추가 할 경우 DB 의 유저 정보에 url list 에 추가한다.
   */
  const [selectedUrlIndex, setSelectedUrlIndex] = React.useState<number>(0);

  /* url 입력 popper 와 아바타 popover ref */
  const menuAnchorEl = useAnchorEl();
  const addAnchorEl = useAnchorEl();

  /* url 정규식 */
  const regUrl = /(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  /* url 과 url name 입력 */
  const urlInput = useEventTargetValue();
  const nameInput = useEventTargetValue();

  const handleUrlDupleCheck = (urlList: Url[], newUrl: Url) => {
    console.log(urlList, newUrl)
    return urlList.find((each) =>
      each.url === newUrl.url
      || each.urlName === newUrl.urlName);
  }

  React.useEffect(() => {
    getUrlRequest({
      params: {
        userId: userContext.user.id
      }
    });
  }, [userContext.user])


  return (
    // <ClickAwayListener onClickAway={addAnchorEl.handleAnchorClose}>
    <Grid
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      { urlsData && !urlError && !urlLoading && urlsData.map((each, index) => (
        <Button className={classes.avatarWrapper} key={each.index}>
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
              onClick={() => {
                window.location.assign('http://' + each.url)
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
        disabled={!userContext.user.id}
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
            <CreateIcon color="primary" style={{ fontWeight: 'bold' }} />
          </ListItemIcon>
          <Typography variant="body1">
            변경
          </Typography>
        </MenuItem>
        <MenuItem
          dense
          button
          onClick={() => {
            deleteUrlRequest({
              data: {
                name: urlsData[selectedUrlIndex].urlName,
                userId: urlsData[selectedUrlIndex].userId,
                url: urlsData[selectedUrlIndex].url,
                index: urlsData[selectedUrlIndex].index,
              }
            }).then(() => {
              menuAnchorEl.handleAnchorClose();
              getUrlRequest({
                params: {
                  userId: userContext.user.id
                }
              });
            })
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
          className={classes.textField}
          variant="outlined"
          label="URL"
          placeholder="www.example.com"
          value={urlInput.value}
          onChange={urlInput.handleChange}
          error={!regUrl.test(urlInput.value)}
          helperText="올바른 url 을 입력해 주세요 example.com"
          inputProps={{
            style: {
              fontFamily: 'AppleSDGothicNeo',
              fontSize: '18px',
              fontWeight: 'bold',
            },
          }}
        />

        <TextField
          className={classes.textField}
          variant="outlined"
          label="Name"
          placeholder="url name"
          value={nameInput.value}
          onChange={nameInput.handleChange}
          error={nameInput.value.length === 0}
          helperText="url 이름을 입력해 주세요"
          style={{
            marginTop: '16px'
          }}
          inputProps={{
            style: {
              fontFamily: 'AppleSDGothicNeo',
              fontSize: '18px',
              fontWeight: 'bold',
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          style={{
            marginTop: '16px'
          }}
          disabled={!(nameInput.value && regUrl.test(urlInput.value))}
          onClick={() => {
            const newUrl: Url = {
              url: urlInput.value,
              urlName: nameInput.value,
              userId: userContext.user.id ? userContext.user.id : '',
            }
            if (handleUrlDupleCheck(urlsData, newUrl)) {
              alert('중복된 url 입니다.')
            } else {
              postUrlRequest({
                data: {
                  url: urlInput.value,
                  name: nameInput.value
                }
              }).then(() => {
                getUrlRequest({
                  params: {
                    userId: userContext.user.id
                  }
                });
                addAnchorEl.handleAnchorClose();
              })
            }
          }}
        >
          추가하기
        </Button>

      </Popper>

    </Grid >
    //* </ClickAwayListener> */ }
  )
}