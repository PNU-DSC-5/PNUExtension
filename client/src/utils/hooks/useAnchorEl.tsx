import React from 'react';


export interface AnchorElHooks {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleAnchorOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleAnchorClose: () => void;
}

export default function useAnchorEl(): AnchorElHooks {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleAnchorOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleAnchorClose = (): void => {
    setAnchorEl(null);
  };

  return {
    open, handleAnchorClose, handleAnchorOpen, anchorEl
  }
}