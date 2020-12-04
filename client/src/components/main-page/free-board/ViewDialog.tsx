import React from 'react';
import {
  DialogContent, Dialog, DialogTitle, Typography, Button,
  IconButton, TextField, Fade,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import { FreeBoard } from '../shared/interfaces/freeBoard.interface';
import {FreeBoardPatch} from '../shared/dto/freeBoardPatch.dto';
import {FreeBoardDelete} from '../shared/dto/freeBoardDelete.dto';
import useEventTargetValue from '../../../utils/hooks/useEventTargetValue';
import UserContext from '../../../utils/contexts/UserContext';


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
  const { open, handleClose, selectedContent,handleGetFreeBoardData } = props;
  const classes = useStyles();

  const userContext = React.useContext(UserContext);

  const [dialogState, setDialogState] = React.useState<'edit'|'view'>('view');
  const titleInput = useEventTargetValue(selectedContent.title);
  const contentInput = useEventTargetValue(selectedContent.content);

  /**
   * update 요청 핸들러 및 함수
   */
  const [, patchFreeBoard] = useAxios<boolean>({
    url: '/free-board',
    method: 'PATCH',
  }, { manual: true });

  const handleUpdateFreeBoard = () => {
    const params: FreeBoardPatch = {
      _index: selectedContent._index,
      title: titleInput.value,
      content: contentInput.value,
      likes: selectedContent.likes,
      views: selectedContent.views,
      category: selectedContent.category,
      tag: selectedContent.tag
    };

    patchFreeBoard({
      data: params
    }).then(() => {
      handleGetFreeBoardData();
      handleInputReset();
      setDialogState('view');
      handleClose();   
    })
    .catch(() => {
      alert('게시물 수정에 문제가 발생 했습니다. 다시 시도해주세요');
    })
  };

  /**
   * delete 핸들러 및 요청 함수
   */
  const [, deleteFreeBoard] = useAxios<boolean>({
    url: '/free-board',
    method: 'DELETE',
  }, { manual: true });

  const handleDeleteFreeBoard = () => {
    const params: FreeBoardDelete = {
      _index: selectedContent._index
    };

    deleteFreeBoard({
      data: params
    }).then(() => {
      handleGetFreeBoardData();
      handleInputReset();
      setDialogState('view');
      handleClose();     
    })
    .catch(() => {
      alert('게시물 삭제에 문제가 발생 했습니다. 다시 시도해주세요');
    })
  }

  /**
   * title, content 리셋 핸들러
   */
  const handleInputReset = () => {
    titleInput.handleReset();
    contentInput.handleReset();
  };

  
  /**
   * 로그인 유저와 작성자를 비교
   * @param originId 로그인 유저
   * @param compareId 작성자
   */
  const handleCheckAuthor = (originId: string, compareId: string):boolean => {
    return originId === compareId;
  }

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
      <Fade in={Boolean(dialogState)} style={{ transitionDelay: '200ms' }}>
        <DialogTitle style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography variant="h6" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            {dialogState === 'view' ? `${selectedContent.userId} 님의 게시물` : '게시물 수정하기'}
            <IconButton
              style={{ marginLeft: 16 }}
              size="small"
              onClick={() => { 
                if(handleCheckAuthor(userContext.user.id || '', selectedContent.userId)){
                  setDialogState('edit');
                } else{
                  alert('작성자만 게시물을 수정 혹은 삭제 할 수 있습니다.')
                }
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton size="small"
              onClick={() => {
                if(handleCheckAuthor(userContext.user.id || '', selectedContent.userId)){
                  handleDeleteFreeBoard();
                } else{
                  alert('작성자만 게시물을 삭제 할 수 있습니다.')
                }
              }}
            >
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
            {/* <TextField
                  variant="outlined"
                  label="카테고리"
                />
                <TextField
                  variant="outlined"
                  label="태그"
                /> */}
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
                minHeight: 700,
                width: '100%',
              },
            }}
            className={classes.TextField}
            disabled={dialogState !== 'edit'}
          />

          {dialogState === 'edit' && (
            <Fade in={dialogState==='edit'} style={{ transitionDelay: '200ms' }}>
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
                if(handleCheckAuthor(userContext.user.id || '', selectedContent.userId)){
                  handleUpdateFreeBoard();
                } else{
                  alert('작성자만 게시물을 수정 할 수 있습니다.')
                }
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
