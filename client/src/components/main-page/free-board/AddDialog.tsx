import React from 'react';
import {
  DialogContent, Dialog, DialogTitle, Typography, Button,
  IconButton, TextField,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import useEventTargetValue from '../../../utils/hooks/useEventTargetValue';
import { FreeBoardPost } from '../shared/dto/freeBoardPost.dto';

const useStyles = makeStyles((theme) => createStyles({
  dialogContent: {
    minHeight: 900,
    minWidth: 900,
  },
  TextField: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

export interface AddDialogProps {
  open: boolean;
  handleClose: () => void;
  handleGetFreeBoardData: () => void;

}

export default function AddDialog(props: AddDialogProps): JSX.Element {
  const { open, handleClose,handleGetFreeBoardData } = props;
  const classes = useStyles();

  const titleInput = useEventTargetValue();
  const contentInput = useEventTargetValue();

  const [, postFreeBoard] = useAxios<boolean>({
    url: '/free-board',
    method: 'POST',
  }, { manual: true });

  const handleInputReset = () => {
    titleInput.handleReset();
    contentInput.handleReset();
  };

  const handleAddFreeBoard = () => {
    const params: FreeBoardPost = {
      title: titleInput.value,
      content: contentInput.value,
      createdAt: new Date(),
      likes: 0,
      views: 0,
    };

    postFreeBoard({
      data: params,
    }).then(() => {
      handleGetFreeBoardData();
      handleClose();
      handleInputReset();
    }).catch(() => {
      alert('새 게시물을 등록 할 수 없습니다. 다시 시도해주세요.');
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      scroll="body"
      PaperProps={{
        style: {
          backgroundColor: '#ffff',
          borderRadius: 16,
          padding: 16,
        },
      }}
    >
      <DialogTitle style={{ display: 'flex', flexDirection: 'row' }}>
        <Typography variant="h6" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          게시물 작성

          {/* <IconButton style={{ marginLeft: 16 }} size="small">
            <EditIcon />
          </IconButton>
          <IconButton size="small">
            <DeleteIcon />
          </IconButton> */}
        </Typography>
      </DialogTitle>

      <DialogContent
        className={classes.dialogContent}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TextField
            variant="outlined"
            value={titleInput.value}
            onChange={titleInput.handleChange}
            className={classes.TextField}
            label="제목"
            color="primary"
            style={{
              maxWidth: 400,
            }}
            inputProps={{
              style: {

              },
            }}
          />
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'row',
              width: '100%',
              marginTop: 16,
            }}
          >
            {/* <TextField
                  variant="outlined"
                  label="카테고리"
                />
                <TextField
                  variant="outlined"
                  label="태그"
                /> */}
          </div>

          <TextField
            variant="outlined"
            color="primary"
            value={contentInput.value}
            onChange={contentInput.handleChange}
            multiline
            style={{
              marginTop: 16,
            }}
            className={classes.TextField}
            inputProps={{
              style: {
                minHeight: 700,
                width: '100%',
              },
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              marginTop: 32,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={!contentInput.value || !titleInput.value}
              onClick={() => {
                handleAddFreeBoard();
              }}
            >
              완료
            </Button>
            <Button
              variant="outlined"
              style={{ marginLeft: 16 }}
              onClick={() => {
                handleClose();
                handleInputReset();
              }}
            >
              취소
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
