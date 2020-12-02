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
          title="게시판"
          icons={TableIcons}
          columns={[
            { title: 'NO', field: 'index', cellStyle:{width: 30}, headerStyle:{width:  30}},
            { title: '제목', field: 'title', cellStyle:{width: 900}, headerStyle:{width: 900}},
            { title: '작성자', field: 'userId' ,cellStyle:{width: 30}, headerStyle:{width: 30}},
            { title: '작성일', field: 'createdAt',cellStyle:{width: 30}, headerStyle:{width: 30}}, 
            { title: '조회수', field: 'view',cellStyle:{maxWidth: '10px'}, headerStyle:{maxWidth: '10px'}}, 
            { title: '좋아요', field: 'like',cellStyle:{maxWidth: '10px'}, headerStyle:{maxWidth: '10px'}, render: rowData=>(<div style={{width: '10px'}}>aa</div>)}, 
          ]}
          data={[
           {index: 0, title: 'testtesttesttest',userId:'qjqdn1568', createdAt:'2020-09-20',view: 33,like:23}
          ]}
          options={{
            search: true,
          }}
          onRowClick={()=> console.log()}
        />
      </Grid>
    </Grid>
  );
}
