import React from 'react';

interface BasicDialog {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

export default function useBasicDialog(): BasicDialog {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return {
    open, handleClose, handleOpen
  }
}