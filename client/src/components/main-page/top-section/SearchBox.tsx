import React from 'react';

// material-ui core components
import {
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  OutlinedInput,
  IconButton,
  ClickAwayListener
} from '@material-ui/core';

// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// hooks
import useEventTargetValue from '../../../utils/hooks/useEventTargetValue';
import useAnchorEl from '../../../utils/hooks/useAnchorEl';

// material-ui icons
import SearchIcon from '@material-ui/icons/Search';

// sub component
import HistoryPopper from './HistoryPopper';
import { spreadKorean } from './spreadKorean';
import { VerticalAlignTopRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      '& label.Mui-focused': {
        color: 'white',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: theme.palette.secondary.light,
        },
        '&:hover fieldset': {
          borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'white',
          border: '3px solid'
        },
      },
      width: '700px',
      height: 'auto',
    },
    searchBackground: {
      padding: theme.spacing(1),
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
      },
    },
  }),
);

const dummy: string[] = [
  '나락',
  '극락',
  '굿',
  '에바',
  '지렷다',
  '노답',
  '가능?',
  '레전드',
  '침디',
  'abc',
  'efg'
];

export default function SearchBox(): JSX.Element {
  const classes = useStyles();
  const { value, handleChange, setValue } = useEventTargetValue();
  const { open, handleAnchorClose, handleAnchorOpen, anchorEl } = useAnchorEl();

  const [history, setHistory] = React.useState<string[]>(dummy);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);

  const handleSearchIconButton = () => {
    if (value.length > 0)
      window.location.assign(
        'https://www.google.com/search?q=' + value,
      );
  };

  /**
   * 입력한 단어를 단어 리스트에 존재하는 스트링 중 최대 일치 스트링 비교 후 필터링
   * @param targetString 사용자가 입력한 e.target.value
   * 
   * 추후 추가사항 -> 최대부분 집합에서 종속 순열 찾기로
   */
  const filterKoeranSpread = (targetString: string): string[] => {
    /* 한글이 포함되어 있는 경우 자모 분리 */
    return history.filter(
      (hist) => spreadKorean(targetString).split('').every(
        (each) => spreadKorean(hist).split('').includes(each)
      ),
    )
  }

  /**
   * up , down , enter 키보드 리스트 셀렉터
   * @param e popper 가 열린 이후 keyboard input, focus 는 그대로 텍스트 필드에
   */
  const handleKeyboard = (e: React.KeyboardEvent<HTMLDivElement | HTMLTextAreaElement | HTMLInputElement>): void => {
    if (e.key === 'ArrowDown') {
      if (filterKoeranSpread(value)[selectedIndex + 1]) {
        /* -1 인덱스를 통해 enter 키의 편리 제공 */
        if (selectedIndex + 1 < history.length) setSelectedIndex(selectedIndex + 1);
      } else setSelectedIndex(-1);

    } else if (e.key === 'ArrowUp') {
      /* length 인덱스를 통해 enter 키의 편리 제공 */
      if (filterKoeranSpread(value)[selectedIndex - 1]) {
        if (selectedIndex - 1 >= 0) setSelectedIndex(selectedIndex - 1);
      } else setSelectedIndex(filterKoeranSpread(value).length);

    } else if (e.key === 'Enter') {
      if (value.length > 0) {
        if (selectedIndex != -1 && selectedIndex != history.length) {
          setValue(filterKoeranSpread(value)[selectedIndex])
          window.location.assign(
            'https://www.google.com/search?q=' + filterKoeranSpread(value)[selectedIndex],
          );
        } else {
          window.location.assign(
            'https://www.google.com/search?q=' + value,
          );
        }
        handleAnchorClose();
      }
    }
  };

  return (
    <ClickAwayListener onClickAway={handleAnchorClose}>

      <Grid>
        <FormControl
          className={classes.textField}
        >
          <OutlinedInput
            value={value}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSearchIconButton}
                  color="secondary"
                  className={classes.searchBackground}
                >
                  <SearchIcon fontSize="large" style={{ color: 'white' }} />
                </IconButton>
              </InputAdornment>
            }
            inputProps={{
              style: {
                marginLeft: '16px',
                fontFamily: 'AppleSDGothicNeo',
                fontSize: '22px',
                fontWeight: 440,
                color: '#ffff',
              },
            }}
            onClick={(e) => handleAnchorOpen(e)}
            onKeyUp={(event) => {
              handleKeyboard(event);
            }}
          />
        </FormControl>

        <HistoryPopper
          open={open && value.length > 0 && filterKoeranSpread(value).length > 0}
          anchorEl={anchorEl}
          history={filterKoeranSpread(value)}
          selectedIndex={selectedIndex}
          setValue={setValue}
        />
      </Grid >

    </ClickAwayListener>
  );
}