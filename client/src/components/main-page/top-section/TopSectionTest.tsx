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
} from '@material-ui/core';

// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// hooks
import useEventTargetValue from '../../../utils/hooks/useEventTargetValue';
import { useHistory } from 'react-router-dom';

import BookMarkList from './book-marks/BookMarkList';

// material-ui icons
import SearchIcon from '@material-ui/icons/Search';
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
// import Favicon from 'react-favicon';

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
        },
      },
      width: '700px',
      height: 'auto',
    },
    searchBackground: {
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
      },
    },
  }),
);

export default function TopTest(): JSX.Element {
  const classes = useStyles();
  const { value, handleChange } = useEventTargetValue();
  const history = useHistory();
  const re = /[\u3131-\uD79D]/giu;

  // const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  // korean.test(string);

  const handleSearch = () => {
    console.log(value);
    if (value.length > 0)
      window.location.replace(
        'https://www.google.com/search?q=' + value.match(re),
      );
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && value.length > 0)
      window.location.replace(
        'https://www.google.com/search?q=' + escape(value),
      );
  };


  return (
    <Grid container direction="column" style={{ marginTop: '60px' }}>
      <Typography color="secondary" variant="h4">
        Top Section
      </Typography>

      <FormControl
        className={classes.textField}
        style={{ alignSelf: 'center', marginTop: '60px' }}
      >
        <OutlinedInput
          value={value}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleSearch}
                color="secondary"
                className={classes.searchBackground}
              >
                <SearchIcon fontSize="large" style={{ color: 'white' }} />
              </IconButton>
            </InputAdornment>
          }
          inputProps={{
            style: {
              textAlign: 'center',
              fontFamily: 'AppleSDGothicNeo',
              fontSize: '35px',
              fontWeight: 440,
              color: '#ffff',
            },
          }}
          onKeyPress={handleEnterKeyPress}
        />
      </FormControl>

      <div
        style={{
          marginTop: '132px'
        }}
      >
        <BookMarkList />
      </div>

      {/* <TextField 
                variant="outlined" 
                value={value}
                onChange={handleChange}
                style={{ alignSelf: 'center', marginTop: '60px' }}
                
                inputProps={{
                    startAdornment:
                      <InputAdornment position="end"><SearchIcon/></InputAdornment>
                    ,
                    style: {
                      textAlign: 'center',
                      fontFamily: 'AppleSDGothicNeo',
                      fontSize: '35px',
                      fontWeight: 440,
                      color: '#ffff'
                    },
                  }}
                InputLabelProps={{
                    style: {
                        fontSize: '35px',
                        backgroundColor: 'inherit',
                    }
                }}
                className={classes.textField}
            >
              <IconButton> 
                  <SearchIcon fontSize="large"/>
              </IconButton>
            </TextField> */}
    </Grid >
  );
}
