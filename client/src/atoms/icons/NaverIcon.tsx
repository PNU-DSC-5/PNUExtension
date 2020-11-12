import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export default function KakaoIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 -6 22 32"><title>soc020 - Regular</title><g id="soc020"><g id="Regular-10" data-name="Regular"><g id="layer1"><path fill="#ffff" id="path2830" d="M3.2,4.632,3.128,27.3l8.912.036.036-9.167L11.489,15.3,19.924,27.3l8.948.073L28.835,4.705l-8.948-.036.183,9.351.587,3.337L12.076,4.669,3.2,4.632Z" /></g></g></g></svg>    </SvgIcon>
  );
}