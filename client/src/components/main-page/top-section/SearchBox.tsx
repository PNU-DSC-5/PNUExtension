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
  ClickAwayListener,
} from '@material-ui/core';

import moment from 'moment';

// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// hooks
import SearchIcon from '@material-ui/icons/Search';
import { VerticalAlignTopRounded } from '@material-ui/icons';
import useEventTargetValue from '../../../utils/hooks/useEventTargetValue';
import useAnchorEl from '../../../utils/hooks/useAnchorEl';

// material-ui icons 

// sub component
import HistoryPopper from './HistoryPopper';
import { spreadKorean } from './spreadKorean';

const useStyles = makeStyles((theme: Theme) => createStyles({
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
        border: '3px solid',
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
}));

type EachHistory = { word: string, time: string }

interface SearchHistory {
  history: EachHistory[]
}

export default function SearchBox(): JSX.Element {
  const classes = useStyles();
  const { value, handleChange, setValue } = useEventTargetValue();
  const {
    open, handleAnchorClose, handleAnchorOpen, anchorEl,
  } = useAnchorEl();
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);

  /* 로컬 스토리지 검색 기록으로 컴포넌트 history init */
  const initHistoryLine = (): string[] => {
    try {
      const localHistory: SearchHistory = JSON.parse(localStorage.getItem('history')!);
      const historyLine: EachHistory[] = localHistory.history.sort(
        (a: EachHistory, b: EachHistory) => (moment(a.time).isBefore(moment(b.time)) ? -1 : 1),
      );

      return historyLine.map((each) => each.word);
    } catch {
      return [];
    }
  };
  const [history, setHistory] = React.useState<string[]>(initHistoryLine());

  /**
   * 검색 기록을 로컬 스토리지에 업데이트 하는 함수
   * @param newWord 검색기록에 추가할 단어
   */
  const handleAddHistory = (newWord: string): void => {
    const localHistory: SearchHistory = JSON.parse(localStorage.getItem('history')!);
    if (localHistory) {
      const newHistory: EachHistory = {
        time: (new Date()).toISOString(),
        word: newWord,
      };

      /* 중복 시 추가 안함 */
      if (!localHistory.history.map((each) => each.word).find((ele) => ele === newWord)) {
        localHistory.history.push(newHistory);

        /* 최신순으로 재정렬 */
        localHistory.history = localHistory.history.sort(
          (a: EachHistory, b: EachHistory) => (moment(a.time).isBefore(moment(b.time)) ? 1 : -1),
        );

        localStorage.setItem('history', JSON.stringify(localHistory));
        setHistory(localHistory.history.map((each) => each.word));
      }
    } else {
      console.log('[Error in search history logic ... ]');
      /* history 가 비어 있었을 경우에 , 알지 못 할 이유로 초기화 되어 있을 경우 예외 처리 */

      const initialHistory: SearchHistory = {
        history: [],
      };

      localStorage.setItem('history', JSON.stringify(initialHistory));
      handleAddHistory(newWord);
    }
  };

  const handleSearchIconButton = () => {
    if (value.length > 0) {
      window.location.assign(
        `https://www.google.com/search?q=${value}`,
      );
    }
  };

  /**
   * 입력한 단어를 단어 리스트에 존재하는 스트링 중 최대 일치 스트링 비교 후 필터링
   * @param targetString 사용자가 입력한 e.target.value
   * 
   * 추후 추가사항 -> 최대부분 집합에서 종속 순열 찾기로
   */
  const filterKoeranSpread = (targetString: string): string[] =>
    /* 한글이 포함되어 있는 경우 자모 분리 */
    history.filter(
      (hist) => spreadKorean(targetString).split('').every(
        (each) => spreadKorean(hist).split('').includes(each),
      ),
    )
  ;

  /**
   * up , down , enter 키보드 리스트 셀렉터
   * @param e popper 가 열린 이후 keyboard input, focus 는 그대로 텍스트 필드에
   * 키보드는 편할 것 같아서 넣어봄
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
          setValue(filterKoeranSpread(value)[selectedIndex]);
          handleAddHistory(filterKoeranSpread(value)[selectedIndex]);
          window.location.assign(
            `https://www.google.com/search?q=${filterKoeranSpread(value)[selectedIndex]}`,
          );
        } else {
          handleAddHistory(value);
          window.location.assign(
            `https://www.google.com/search?q=${value}`,
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
            endAdornment={(
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSearchIconButton}
                  color="secondary"
                  className={classes.searchBackground}
                >
                  <SearchIcon fontSize="large" style={{ color: 'white' }} />
                </IconButton>
              </InputAdornment>
            )}
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
      </Grid>

    </ClickAwayListener>
  );
}
