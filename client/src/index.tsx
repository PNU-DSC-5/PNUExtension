import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Switch, Route, Redirect, Router,
} from 'react-router-dom';
import { configure } from 'axios-hooks';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import cookie from 'react-cookies';
import * as serviceWorker from './serviceWorker';

// 브라우저 라우팅 라이브러리

// axios 설정 파일
import axios from './utils/axios';

// page
import Main from './pages/Main';
import { LayoutAppBar } from './components/appbar/AppBar';

// style
import globalTheme from './theme';

// cookie

// contexts
import UserContext, { useUser } from './utils/contexts/UserContext';
// import { Token } from '../../server/dist/src/shared/interfaces/token.interface';

function Index(): JSX.Element {
  // api 요청 axios 설정 적용
  configure({ axios: axios.axiosInstance });

  // 앱 전체 테마 정의
  const THEME = createMuiTheme({
    ...globalTheme,
    palette: { ...globalTheme.palette },
  });

  const {
    user,
    handleLogout,
    handleProfile,
    state,
    handleAutoLogin,
    handleGetToken,
  } = useUser();

  // 페이지 렌더링 -> access Token 및 refresh Token 확인
  React.useEffect(() => {
    // console.log(
    //   'test for master branch ...',
    //   cookie.load('uuid'),
    // );

    // console.log(window.location.href.split('/'));

    const id = window.location.href.split('/')[3];

    if (id) {
      /* uuid 를 통한 토큰 요청  */
      const promiseToken = handleGetToken(id) as Promise<any>;

      promiseToken.then((token) => {
        /* 로컬 스토리지에 삽입  */
        window.localStorage.removeItem('uuid');
        window.localStorage.setItem('uuid', token.data.uuid);

        console.log('[Token in Index.tsx] ... ', token);

        axios.setAxiosHeaders('accesstoken', token.data.accessToken);
        cookie.save('accessToken', token.data.accessToken, {});
        cookie.save('refreshToken', token.data.refreshToken, {});

        handleProfile();
      });
    }

    /* uuid 가 쿠키에 존재  */
    if (cookie.load('uuid')) {
      // window.localStorage.clear();
      window.localStorage.removeItem('uuid');

      /* 로컬 스토리지에 삽입  */
      window.localStorage.setItem('uuid', cookie.load('uuid'));
    }

    /* access token 이 쿠키에 존재 */
    if (cookie.load('accessToken')) {
      // accessToken 을 axios 디폴트 요청 헤더에 삽입해야한다.
      console.log(cookie.load('accessToken'));
      axios.setAxiosHeaders('accesstoken', cookie.load('accessToken'));
      handleProfile();
    } else if (!cookie.load('accessToken')) {
      axios.setAxiosHeaders('accesstoken', null);
    }
  }, [handleProfile]);

  React.useEffect(() => {
    if (!cookie.load('accessToken') && localStorage.getItem('uuid')) {
      handleAutoLogin();
    }
  }, [handleAutoLogin]);

  return (
    <ThemeProvider theme={THEME}>
      {/* 앱 전체 테마 설정 */}
      {/* 유저 컨택스트 제공자 설정 */}
      <UserContext.Provider
        value={{
          user,
          handleLogout,
          handleProfile,
          state,
          handleAutoLogin,
          handleGetToken,
        }}
      >
        <BrowserRouter>
          {/* 상단 고정 앱 바 */}
          <LayoutAppBar />

          {/* 라우팅 스위치 */}
          <Switch>
            {/* 메인 페이지 */}
            <Route path="/" component={Main} />
          </Switch>
        </BrowserRouter>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));

serviceWorker.unregister();
