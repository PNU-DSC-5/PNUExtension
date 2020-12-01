import React, { forwardRef } from 'react';
import { Button, Grid } from '@material-ui/core';
import MaterialTable from 'material-table';

import { makeStyles } from '@material-ui/core/styles';
import { TableIcons } from './TableIcons';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    color: 'black',
  },
});

export default function NoticeBoard(): JSX.Element {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      spacing={2}
      justify="flex-start"
    >
      <Grid item xs={8}>
        <MaterialTable
          title="Basic Search Preview"
          icons={TableIcons}
          columns={[
            { title: 'Name', field: 'name' },
            { title: 'Surname', field: 'surname' },
            { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
            {
              title: 'Birth Place',
              field: 'birthCity',
              lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
            },
          ]}
          data={[
            {
              name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63,
            },
            {
              name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34,
            },
          ]}
          options={{
            search: true,
          }}
        />
      </Grid>
    </Grid>
  );
}
