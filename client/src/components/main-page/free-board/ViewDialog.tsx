import React from 'react';
import {
  DialogContent, Dialog, DialogTitle, Typography, Button,
  IconButton, TextField, FormControl, InputLabel, MenuItem, Select,
  Checkbox, FormControlLabel, Fade,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import { FreeBoard } from '../shared/interfaces/freeBoard.interface';
import { FreeBoardPatch } from '../shared/dto/freeBoardPatch.dto';
import useEventTargetValue from '../../../utils/hooks/useEventTargetValue';

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

const DarkerDisabledTextField = withStyles({
  root: {
    marginRight: 8,
    '& .MuiInputBase-root.Mui-disabled': {
      color: 'black', // (default alpha is 0.38)
    },
  },
})(TextField);

export interface AddDialogProps {
  open: boolean;
  handleClose: () => void;
  handleGetFreeBoardData: () => void;
  selectedContent: FreeBoard;
}

export default function ViewDialog(props: AddDialogProps): JSX.Element {
  const {
    open, handleClose, selectedContent, handleGetFreeBoardData,
  } = props;
  const classes = useStyles();

  const [dialogState, setDialogState] = React.useState<'edit'|'view'>();
  const titleInput = useEventTargetValue(selectedContent.title);
  const contentInput = useEventTargetValue(selectedContent.content);

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

  const [, patchFreeBoard] = useAxios<boolean>({
    url: '/free-board',
    method: 'PATCH',
  }, { manual: true });

  const handleInputReset = () => {
    titleInput.handleReset();
    contentInput.handleReset();
  };

  const handleUpdateFreeBoard = () => {
    const params: FreeBoardPatch = {
      _index: selectedContent._index,
      title: titleInput.value,
      content: contentInput.value,
      likes: selectedContent.likes,
      views: selectedContent.views,
      category: selectedContent.category,
      tag: selectedContent.tag,
      isSecret: true,
    };

    patchFreeBoard({
      data: params,
    }).then(() => {
      handleGetFreeBoardData();
      handleInputReset();
      handleClose();
      setDialogState('view');
    })
      .catch(() => {
        alert('게시물 수정에 문제가 발생 했습니다. 다시 시도해주세요');
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
      <Fade in style={{ transitionDelay: '200ms' }}>
        <DialogTitle style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography variant="h6" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            {dialogState === 'view' ? `${selectedContent.userId} 님의 게시물` : '게시물 수정하기'}
            <IconButton
              style={{ marginLeft: 16 }}
              size="small"
              onClick={() => {
                setDialogState('edit');
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton size="small">
              <DeleteIcon />
            </IconButton>
          </Typography>
        </DialogTitle>
      </Fade>

      <DialogContent
        className={classes.dialogContent}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <DarkerDisabledTextField
            variant="outlined"
            label="제목"
            color="primary"
            value={titleInput.value}
            onChange={titleInput.handleChange}
            style={{
              maxWidth: 400,
            }}
            inputProps={{
              style: {

              },
            }}
            className={classes.TextField}
            disabled={dialogState !== 'edit'}
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
                disabled={dialogState !== 'edit'}
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
                disabled={dialogState !== 'edit'}
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
                  disabled={dialogState !== 'edit'}
                  checked={isSecret}
                  onChange={handleIsSecretCjhange}
                  name="익명"
                  color="primary"
                />
              )}
              label="익명이"
            />
          </div>

          <DarkerDisabledTextField
            variant="outlined"
            color="primary"
            multiline
            value={contentInput.value}
            onChange={contentInput.handleChange}
            style={{
              marginTop: 16,
            }}
            inputProps={{
              style: {
                minHeight: 500,
                width: '100%',
              },
            }}
            className={classes.TextField}
            disabled={dialogState !== 'edit'}
          />

          {dialogState === 'edit' && (
            <Fade in={dialogState === 'edit'} style={{ transitionDelay: '200ms' }}>
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
                    handleUpdateFreeBoard();
                  }}
                >
                  수정
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
            </Fade>

          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
