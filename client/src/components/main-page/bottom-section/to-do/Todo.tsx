import React from "react";
import TodoDialog from "./TodoDialog";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DoneIcon from "@material-ui/icons/Done";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => createStyles({
  section: {
    height: '100%',
    width: '100%',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    borderRadius: 8,
  },
}));


export default function Todo(): JSX.Element {
  const classes = useStyles();

  const [data, setData] = React.useState([
    "item 1",
    "item 2",
    "item 3",
    "item 4", 
  ]);

  const [checked, setChecked] = React.useState([0]);
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");
  const handleClickOpen = (scrollType: DialogProps["scroll"]) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Paper className={classes.section}>
      <Button onClick={handleClickOpen("paper")}>
        <Typography
          variant="body1"
          align="center"
          color="textPrimary"
          style={{ fontWeight: "bold" }}
        >
          TODO
        </Typography>
      </Button>
      <List>
        {data.map((value, index) => {
          const labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem
              key={value}
              role={undefined}
              dense
              button
              onClick={handleToggle(index + 1)}
              style={{ height: 26 }}
            >
              <ListItemIcon>
                <DoneIcon />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.slice(0, 15)}`} />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={(e) => {
                    let newData: string[] = [];
                    for (let i = 0; i < data.length; i++) {
                      if (i != index) newData.push(data[i]);
                    }
                    setData(newData);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <TodoDialog
        inputData={data}
        setOriginData={setData}
        open={open}
        setOpen={setOpen}
      />
    </Paper>
  );
}
