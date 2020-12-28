import React from 'react';
import {
  Popper,
  List,
  ListItem,
  Typography,
  ClickAwayListener,
  IconButton,
  Badge,
  // Button,
  Divider,
} from '@material-ui/core';

// styles
import {
  createStyles,
  makeStyles,
  Theme,
  fade,
} from '@material-ui/core/styles';

import useAxios from 'axios-hooks';
import moment from 'moment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RefreshIcon from '@material-ui/icons/Refresh';

import { Notification } from './shared/interfaces/notification.interface';
import { NotificationPatch } from './shared/dto/notificationPatch.dto';

const useStyles = makeStyles((theme: Theme) => createStyles({
  list: {
    width: 500,
    maxHeight: 400,
    backgroundColor: theme.palette.background.paper,
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  listItem: {
    width: '100%',
    // height: 100,
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    // marginBottom: 1
  },
}));

export interface NotificationPopperProps {
  open: boolean;
  anchorEl: HTMLElement;
  handleClose: () => void;
}

export default function NotificationPopper(
  props: NotificationPopperProps,
): JSX.Element {
  const classes = useStyles();
  const { open, anchorEl, handleClose } = props;

  const [
    {
      data: notificationsData,
      loading: notifcationsLoading,
      error: notificationsError,
    },
    excuteGetNotifications,
  ] = useAxios<Notification[]>(
    {
      url: '/notification',
      method: 'GET',
    },
    { manual: true },
  );

  const [, excutePatchNotifications] = useAxios<boolean>(
    {
      url: '/notification',
      method: 'PATCH',
    },
    { manual: true },
  );

  React.useEffect(() => {
    excuteGetNotifications();
  }, [excuteGetNotifications]);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Popper
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        transition
        // disablePortal
        placement="bottom-start"
      >
        <List className={classes.list}>
          {notificationsData
            && notificationsData.length > 0
            && notificationsData.map((notification) => (
              <ListItem
                button
                className={classes.listItem}
                onClick={() => {
                  const params: NotificationPatch = {
                    _index: notification._index,
                    option: 'READ',
                  };
                  excutePatchNotifications({
                    data: params,
                  }).then(() => {
                    excuteGetNotifications();
                  });
                }}
              >
                <Badge
                  color="primary"
                  invisible={notification.isRead}
                  variant="dot"
                >
                  <Typography variant="h6" style={{ marginBottom: 16 }}>
                    {notification.title}
                  </Typography>
                </Badge>
                <Typography variant="body1" style={{ marginBottom: 8 }}>
                  {moment(notification.createdAt).format('MM-DD HH:MM')}
                </Typography>
                <Typography variant="body1">{notification.content}</Typography>
                <Divider />
              </ListItem>
            ))}

          {(notificationsError || notifcationsLoading || notificationsData?.length === 0) && (
            <Typography variant="h6" align="center">
              표시할 알림이 없습니다.

              <span style={{ marginLeft: 16 }}>
                <IconButton
                  onClick={() => {
                    excuteGetNotifications();
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Typography>
          )}
        </List>
      </Popper>
    </ClickAwayListener>
  );
}
