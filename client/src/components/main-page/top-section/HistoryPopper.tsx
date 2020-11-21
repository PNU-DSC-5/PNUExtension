import React from 'react'

import { makeStyles, Theme, createStyles, fade } from '@material-ui/core/styles';

import {
  TextField, ClickAwayListener, Popper, List, ListItem,
  Typography,
} from '@material-ui/core';

// material-ui icons
import SearchIcon from '@material-ui/icons/Search';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: fade(theme.palette.primary.light, 0.9),
      width: '696px',
      zIndex: 999,
      border: `2px solid ${fade(theme.palette.primary.light, 0.9)}`,
      borderRadius: 4
    }
  }),
);

interface HistoryPopperProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  history: string[];
  selectedIndex: number;
  setValue: (value: React.SetStateAction<string>) => void
}

export default function HistoryPopper(props: HistoryPopperProps): JSX.Element {
  const { anchorEl, open, history, selectedIndex, setValue } = props;
  const classes = useStyles();

  return (
    <Popper
      className={classes.root}
      placement="bottom-start"
      anchorEl={anchorEl}
      open={open}
      disablePortal
      modifiers={{
        flip: { enabled: false },
        preventOverflow: { enabled: false, boundariesElement: 'scrollParent' },
        hide: { enabled: false },
      }}
    >
      <List
        style={{
          maxHeight: '200px',
          overflowY: 'hidden'
        }}
      >
        {history.map((eachHistory, index) => (
          <ListItem
            button
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
            selected={selectedIndex === index}
            onClick={() => setValue(eachHistory)}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <SearchIcon
                style={{
                  marginRight: '16px',
                  color: 'white'
                }}
              />
              <Typography color="secondary" variant="h5">
                {eachHistory}
              </Typography>
            </div>

            {selectedIndex === index && (
              <CheckIcon
                style={{
                  fontWeight: 'bold',
                  color: '#69db7c',
                  alignSelf: 'flex-end'
                }}
              />
            )}

          </ListItem>
        ))}
      </List>
    </Popper>
  )
}