import React from 'react';
import useAxios from 'axios-hooks';
import { AxiosError } from 'axios';
import cookie from 'react-cookies';

import { Payload as UserInfo } from '../../shared/interfaces/token.interface';

// export interface UserInfo {
//   name: string | null;
//   picture: string | null;
//   email: string | null;
//   roles: 'user' | 'admin';
//   url: 
// }

export interface UserContextValue {
  user: UserInfo;
  handleProfile: () => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
  handleGetToken: (uuid: string) => void;
  state: 'logined' | 'static' | undefined;
}

export const defaultUser: UserInfo = {
  name: null,
  picture: null,
  email: null,
  roles: 'user',
  url: [],
  id: null,
};

const UserContext = React.createContext<UserContextValue>({
  user: defaultUser,
  handleProfile: () => {},
  handleLogout: () => {},
  handleAutoLogin: () => {},
  handleGetToken: () => {},
  state: undefined,
});

export function useUser(): UserContextValue {
  const [user, setUser] = React.useState<UserInfo>(defaultUser);
  const [state, setState] = React.useState<'logined' | 'static' | undefined>(undefined);

  const [{
    data: tokenData,
    error: tokenError,
    loading: tokenLoading,
  },
  excuteGetToken] = useAxios<any>({
    url: 'https://back-dot-pnuextension.dt.r.appspot.com/users/login/token',
    method: 'POST',
  }, { manual: true });

  const [{
    data: profileData,
    error: profileError,
    loading: profileLoading,
  },
  excuteGetProfile] = useAxios<UserInfo>({
    url: 'https://back-dot-pnuextension.dt.r.appspot.com/users/login/check-profile',
  }, { manual: true });

  const [{
    data: autoLoginData,
    error: autoLoginError,
    loading: autoLoginLoading,
  },
  excuteAutoLogin] = useAxios<UserInfo>({
    url: 'https://back-dot-pnuextension.dt.r.appspot.com/users/login/auto-login',
    method: 'post',
  }, { manual: true });

  const handleGetToken = (uuid: string) => {
    excuteGetToken({
      data: {
        keyId: uuid,
      },
    }).then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    });
  };

  const handleAutoLogin = () => {
    const uuid = window.localStorage.getItem('uuid');
    if (uuid && uuid.length > 10) {
      console.log('[Auto Login Start ... ]');
      return excuteAutoLogin({
        data: {
          uuid,
        },
      })
        .then((res) => {
          console.log('[UserContext Setting By Auto Login ...]');
          setUser(res.data);
          setState('logined');
        })
        .catch((err) => {
          console.log('[UserContext Error : AutoLogin ...]', err);
        });
    }
  };

  const handleProfile = React.useCallback(() => {
    console.log('[Profile Check Start ... ]');
    if (cookie.load('accessToken')) {
      return excuteGetProfile({
        headers: {
          accessToken: cookie.load('accessToken'),
        },
      })
        .then((res) => {
          if (res.data) {
            console.log('[UserContext Setting ...]');
            setUser(res.data);
            setState('logined');
          }
        })
        .catch((err) => {
          console.log('[UserContext Error : Get Profile ...]', err);
        });
    }
  }, [excuteGetProfile, cookie.load('accessToken')]);

  const handleLogout = () => {
    cookie.remove('accessToken');
    cookie.remove('refreshToken');
    cookie.remove('error');
    cookie.remove('uuid');

    window.localStorage.removeItem('uuid');

    setUser(defaultUser);
    setState(undefined);

    window.location.reload();
  };

  return {
    user,
    state,
    handleProfile,
    handleLogout,
    handleAutoLogin,
    handleGetToken,
  };
}

export default UserContext;
