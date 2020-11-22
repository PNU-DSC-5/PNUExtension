import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function BasicTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{width: '100px'}}>시간</TableCell>
            <TableCell align="center">월</TableCell>
            <TableCell align="center">화</TableCell>
            <TableCell align="center">수</TableCell>
            <TableCell align="center">목</TableCell>
            <TableCell align="center">금</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell align="center">
                {row.name}
              </TableCell> 

              <TableCell align="center" style={{backgroundColor: 'red'}}>{row.calories}</TableCell>
              <TableCell align="center" style={{backgroundColor: 'blue'}}>{row.fat}</TableCell>
              <TableCell align="center" style={{backgroundColor: 'green'}}>{row.carbs}</TableCell>
              <TableCell align="center" style={{backgroundColor: 'yellow'}}>{row.protein}</TableCell>
              <TableCell align="center" style={{backgroundColor: 'purple'}}>{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}