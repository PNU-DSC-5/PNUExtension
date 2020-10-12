  
import axios,{AxiosRequestConfig} from 'axios';
import { Console } from 'console';

// cookie
import cookie from 'react-cookies';

import HTTPError from './httpError';

import refreshByToken from './refreshToken';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;

const postData = {
  config: {},
  method: '',
};

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3000',
});

const setAxiosHeaders = (accessToken: string|null) => {
  axiosInstance.defaults.headers.common['accessToken'] = accessToken;
}

axiosInstance.interceptors.request.use(
 (config) => {
   console.log('Axios Post Request : ',config)
   postData.config = config;
   postData.method = config.method!;
   return config;
 },

 (err) => {
   return err;
 }
)

axiosInstance.interceptors.response.use(
  (config) => {
    return config;
  },
 
  async (err) => {
    
    const errorState = err.response.status;
    if(errorState === 402) { // jwtExpired
      console.log('[Error : Jwt ExpiredIn ... ]', err.response.status);
      const refreshToken = window.localStorage.getItem('refreshToken');
      if(refreshToken){ // refresh token 을 이용한 accessToken 재발급 수행
        console.log('[Refresh Logic Start ... ]');

        axios.defaults.headers.common['refreshtoken'] = refreshToken;
        return axios.post('http://localhost:3000/users/login/refresh',{
          headers: {
            refreshtoken : refreshToken
          }
        })
          .then((res) => {
            if(res){
              console.log('refresh success',res);
              // const reRefreshToken = cookie.load('refreshToken');
              // const reAccessToken = cookie.load('accessToken');
              const errorMessage = cookie.load('error');

              const reRefreshToken = res.data.refreshToken;
              const reAccessToken = res.data.accessToken;

              const testMessage = cookie.load('test');
              console.log(errorMessage);

              console.log('test header : ',testMessage);

              if(reAccessToken && reRefreshToken && res.data){
                console.log('[Success : Refresh by Token ... ]');
                console.log(postData.config)
                window.localStorage.removeItem('refreshToken');
                window.localStorage.setItem('refreshToken', reRefreshToken);

                // setAxiosHeaders(reAccessToken);

                return axios({
                  ...postData.config,
                  headers: {
                    accessToken: reAccessToken
                  }
                })
                  .then((res) => {
                    console.log('res with re request',res);
                    return res.data;
                  })
                  .catch((err) => {
                    console.log(err);
                    return new HTTPError(444, '[Error : Somethine Wrong ... ]'); 
                  })
              }
              else{
                console.log('refresh fail',res);
                throw new HTTPError(401, '[Error : Refresh by Token ... ]'); 
              }
            }
          })
          .catch((err) => {
            console.log('[Error : Refresh by Token ... ]', err);
            return new HTTPError(401, '[Error : Refresh by Token ... ]'); 
          })
      }
      else{
       throw new HTTPError(401, '[Error : Refresh by Token ... ]'); 
      }
    }

    return err;
  }
 )

export default { 
  axiosInstance,
  setAxiosHeaders
}