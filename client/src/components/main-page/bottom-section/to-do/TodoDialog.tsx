import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DoneIcon from "@material-ui/icons/Done";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      height: "100%",
      width: "100%",
      textAlign: "center",
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 8,
    },
    icon: {
      width: 20,
      height: 20,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

interface Props {
  inputData: string[];
  setOriginData: (data: string[]) => void;
  open: boolean;
  setOpen: (flag: boolean) => void;
}

export default function TodoDialog(input: Props): JSX.Element {
  const classes = useStyles();

  /*  const [data, setData] = React.useState([
    "item 1",
    "item 2",
    "item 3",
    "item 4",
  ]);*/

  React.useEffect(() => {
    setOpen(input.open);
  });

  const [open, setOpen] = React.useState(input.open);
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");
  const [data, setData] = React.useState(input.inputData);
  const [newItemInput, setNewItemInput] = React.useState("");

  const handleClose = (work: string) => () => {
    if (work == "save") input.setOriginData(data);
    else setData(input.inputData);
    setOpen(false);
    input.setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      setData(input.inputData);
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const newItemChangeHandler = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setNewItemInput(event.target.value as string);
  };
  const addItemClick = () => {
    if (newItemInput != "") setData([...data, newItemInput]);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth={"md"}
      fullWidth={true}
    >
      <DialogTitle id="scroll-dialog-title">TODO</DialogTitle>
      <DialogContent dividers={true}>
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              TODO LIST
            </ListSubheader>
          }
        >
          {data.map((value, index) => {
            const labelId = `checkbox-list-label-${value}`;

            return (
              <ListItem
                key={value}
                role={undefined}
                dense
                //button
                //onClick={handleToggle(index + 1)}
              >
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <TextField
                  value={data[index]}
                  style={{ width: "90%" }}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    let newData: string[] = [];
                    for (let i = 0; i < data.length; i++) {
                      if (i === index) newData.push(e.target.value as string);
                      else newData.push(data[i]);
                    }
                    setData(newData);
                  }}
                  autoFocus
                />
                <ListItemIcon>
                  <IconButton
                    onClick={(e) => {
                      if (index != data.length - 1) {
                        let newData: string[] = [];
                        let temp = "";
                        for (let i = 0; i < data.length; i++) {
                          if (i != index && i != index + 1)
                            newData.push(data[i]);
                          else if (i == index) temp = data[i];
                          else if (i == index + 1) {
                            newData.push(data[i]);
                            newData.push(temp);
                          }
                        }
                        setData(newData);
                      }
                    }}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                </ListItemIcon>
                <ListItemIcon style={{ marginRight: 10 }}>
                  <IconButton
                    onClick={(e) => {
                      if (index != 0) {
                        let newData: string[] = [];
                        let temp = "";
                        for (let i = 0; i < data.length; i++) {
                          if (i != index && i != index - 1)
                            newData.push(data[i]);
                          else if (i == index - 1) temp = data[i];
                          else if (i == index) {
                            newData.push(data[i]);
                            newData.push(temp);
                          }
                        }
                        setData(newData);
                      }
                    }}
                  >
                    <ArrowDropUpIcon />
                  </IconButton>
                </ListItemIcon>
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
          <ListItem>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <TextField
              id="standard-basic"
              //label="새로운 TODO 추가"
              placeholder="새로운 TODO 추가"
              style={{ width: "90%" }}
              value={newItemInput}
              onChange={newItemChangeHandler}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={addItemClick}>
                <AddIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose("cancel")} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose("save")} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
    /*
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {data
              .map(
                (item) => `${item}`,
              )
              /*.join('\n')/}
          </DialogContentText>*/ //}
  );
}
