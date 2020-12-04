import React from 'react';
import {
  DialogContent, Dialog, DialogTitle, Typography, Button,
  IconButton, TextField, FormControl, InputLabel, MenuItem, Select,
  Checkbox, FormControlLabel,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import useEventTargetValue from '../../../utils/hooks/useEventTargetValue';
import { FreeBoardPost } from '../shared/dto/freeBoardPost.dto';

const useStyles = makeStyles((theme) => createStyles({
  dialogContent: {
    minHeight: 700,
    minWidth: 900,
  },
  TextField: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginLeft: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export interface AddDialogProps {
  open: boolean;
  handleClose: () => void;
  handleGetFreeBoardData: () => void;

}

export default function AddDialog(props: AddDialogProps): JSX.Element {
  const { open, handleClose, handleGetFreeBoardData } = props;
  const classes = useStyles();

  const titleInput = useEventTargetValue();
  const contentInput = useEventTargetValue();

<<<<<<< HEAD
  /**
   * post 요청 함수 및 핸들러
   */
=======
  const [newCategory, setNewCategory] = React.useState<string>('기타');
  const [newTag, setNewTag] = React.useState<string>('기타');
  const [isSecret, setIsSecret] = React.useState<boolean>(false);

  const handleNewCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNewCategory(event.target.value as string);
  };
  const handleNewTagChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNewTag(event.target.value as string);
  };
  const handleIsSecretCjhange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSecret(event.target.checked);
  };

>>>>>>> b117d96c729409c7318bbec753024d5ee9aba560
  const [, postFreeBoard] = useAxios<boolean>({
    url: '/free-board',
    method: 'POST',
  }, { manual: true });

  const handleAddFreeBoard = () => {
    const params: FreeBoardPost = {
      title: titleInput.value,
      content: contentInput.value,
      createdAt: new Date(),
      likes: 0,
      views: 0,
      category: newCategory,
      tag: newTag,
      isSecret,
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

  /**
   * title, content 리셋 핸들러
   */
  const handleInputReset = () => {
    titleInput.handleReset();
    contentInput.handleReset();
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
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">카테고리</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={newCategory}
                onChange={handleNewCategoryChange}
              >
                <MenuItem value="기타">기타</MenuItem>
                <MenuItem value="학교">학교</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">태그</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={newTag}
                onChange={handleNewTagChange}
              >
                <MenuItem value="기타">기타</MenuItem>
                <MenuItem value="AI">AI</MenuItem>
                <MenuItem value="해커톤">해커톤</MenuItem>
                <MenuItem value="정보컴퓨터공학부">정보컴퓨터공학부</MenuItem>
                <MenuItem value="AITIMES">AITIMES</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              className={classes.formControl}
              control={(
                <Checkbox
                  checked={isSecret}
                  onChange={handleIsSecretCjhange}
                  name="익명"
                  color="primary"
                />
              )}
              label="익명이"
            />
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
                minHeight: 500,
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
