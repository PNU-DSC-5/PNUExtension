import React from 'react';
import { Avatar, IconButton } from '@material-ui/core';


// const getFavicons = require('get-website-favicon')

export default function BookMarkList(): JSX.Element {

  React.useEffect(() => {
    // getFavicons('naver.com').then((data: any) => console.log(data))
  }, [])

  const BookMark = (): JSX.Element => (
    <IconButton>
      <Avatar variant="rounded">
        { }
      </Avatar>
    </IconButton>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
      }}
    >
      {BookMark()}
      {BookMark()}
      {BookMark()}
      {BookMark()}
      {BookMark()}
    </div>
  )
}