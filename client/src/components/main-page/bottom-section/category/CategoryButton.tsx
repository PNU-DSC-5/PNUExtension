import React from 'react';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import useAxios from 'axios-hooks';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CategoryButton(): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [formats, setFormats] = React.useState(() => [
    'Hackathon',
    'ITNews',
    'CSE',
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => {
    setFormats(newFormats);
  };

  const handleSave = () => {
    console.log(formats);
    //서버에 데이터 보내기 ㅠㅠㅠㅠ
    putUrlRequest({
      data: {
        category: formats,
      },
    });
    setOpen(false);
  };

  const [, postUrlRequest] = useAxios<any>(
    {
      url: 'http://localhost:3000/url',
      method: 'post',
    },
    { manual: true },
  );

  const [, putUrlRequest] = useAxios<any>(
    {
      url: 'http://localhost:3000/url',
      method: 'put',
    },
    { manual: true },
  );

  return (
    <div style={{ margin: 5 }}>
      <Typography color="secondary">
        Your Category
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClickOpen}
          style={{ margin: 5 }}
        >
          ▼
        </Button>
      </Typography>

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          원하는 카테고리를 선택해주세요. &#160; &#160; &#160;
        </DialogTitle>

        <DialogContent dividers style={{ textAlign: 'center' }}>
          <ToggleButtonGroup
            value={formats}
            orientation="vertical"
            onChange={handleFormat}
            aria-label="category"
            size="large"
          >
            <ToggleButton value="Hackathon" aria-label="Hackathon">
              해커톤
            </ToggleButton>
            <ToggleButton value="ITNews" aria-label="ITNews">
              IT 뉴스
            </ToggleButton>
            <ToggleButton value="CSE" aria-label="CSE">
              학과공지
            </ToggleButton>
          </ToggleButtonGroup>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSave} color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
