import React from 'react';
import useAxios from 'axios-hooks';
import { AxiosError } from 'axios';
import cookie from 'react-cookies';

export interface UserInfo {
  name: string | null;
  picture: string | null;
  email: string | null;
  roles: 'user' | 'admin';
}

export interface UserContextValue {
  user: UserInfo;
  handleProfile: () => void;
  handleLogout: () => void;
  state: "logined" | "static" | undefined;
}

export const defaultUser: UserInfo = {
  name: null,
  picture: null,
  email: null,
  roles: 'user',
};

const UserContext = React.createContext<UserContextValue>({
  user : defaultUser,
  handleProfile: () => {},
  handleLogout: () => {},
  state: undefined,
});

export function useUser(): UserContextValue {
  const [user, setUser] = React.useState<UserInfo>(defaultUser);
  const [state, setState] = React.useState<'logined' | 'static' | undefined>(undefined);

  const [{ 
    data: profileData, 
    error: profileError, 
    loading: profileLoading }, 
    excuteGetProfile ] = useAxios<UserInfo>({
    url: 'http://localhost:3000/users/login/check-profile',
  },{ manual: true });

  const handleProfile = React.useCallback(() => {
    console.log('[Profile Check Start ... ]');
    if(cookie.load('accessToken')){
      return excuteGetProfile({
        headers: {
          accessToken: cookie.load('accessToken')
        }
      })
      .then((res) => {
        if(res.data){
          console.log('[UserContext Setting ...]',res.data);
          setUser(res.data);
          setState('logined');
        }
      })
      .catch((err) => {
        console.log('[UserContext Error : Get Profile ...]',err);
        return false;
      })
    }
    
  },[excuteGetProfile, cookie.load('accessToken')])

  const handleLogout = () => {
    cookie.remove('accessToken');
    cookie.remove('refreshToken');
    cookie.remove('error');
  
    setUser(defaultUser);
    setState(undefined);
  }

  return {
   user,
   state,
   handleProfile,
   handleLogout

  };
}

export default UserContext;