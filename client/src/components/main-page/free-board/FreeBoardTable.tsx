import React, { forwardRef } from 'react';
import { Button, Grid } from '@material-ui/core';
import MaterialTable from 'material-table';

import { makeStyles } from '@material-ui/core/styles';
import { TableIcons } from './TableIcons';
import {FreeBoard} from '../bottom-section/shared/interfaces/freeBoard.interface';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    color: 'black',
  },
});

export interface FreeBoardTableProps {
  freeBoardData: FreeBoard[]
}

export default function FreeBoardTable(props: FreeBoardTableProps): JSX.Element {
  const {freeBoardData } = props;
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
            { title: '카테고리', field: 'category',cellStyle:{width: 30}, headerStyle:{width: 30}}, 
            { title: '태그', field: 'tag',cellStyle:{width: 30}, headerStyle:{width: 30}}, 
            { title: '제목', field: 'title', cellStyle:{width: 900}, headerStyle:{width: 900}},
            { title: '작성자', field: 'userId' ,cellStyle:{width: 30}, headerStyle:{width: 30}},
            { title: '작성일', field: 'createdAt',cellStyle:{width: 30}, headerStyle:{width: 30}}, 
            { title: '조회수', field: 'view',cellStyle:{maxWidth: '10px'}, headerStyle:{maxWidth: '10px'}}, 
            { title: '좋아요', field: 'like',cellStyle:{maxWidth: '10px'}, headerStyle:{maxWidth: '10px'}}, 
          ]}
          data={freeBoardData}
          options={{
            search: true,
          }}
          onRowClick={()=> console.log()}
        />
      </Grid>
    </Grid>
  );
}
