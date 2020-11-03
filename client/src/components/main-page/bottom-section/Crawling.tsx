import React from 'react';

import { Typography } from '@material-ui/core';

interface Props {
  content: string;
}

const Crawling = ({ content }: Props) => {
  return <Typography>{content}</Typography>;
};

export default Crawling;
