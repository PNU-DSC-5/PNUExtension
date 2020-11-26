import React from 'react';

// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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

// sub component
import SearchBox from '../top-section/SearchBox';
import FaviconList from '../top-section/FavicionList';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {

  },
}));

export default function TopSectionLayout(): JSX.Element {
  return (
    <Grid container direction="column" justify="center">

      <Grid style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <SearchBox />
      </Grid>

      <Grid style={{ marginTop: '32px' }}>
        <FaviconList />
      </Grid>

    </Grid>
  );
}
