  
import axios,{AxiosRequestConfig} from 'axios';
import { Console } from 'console';

// cookie
import cookie from 'react-cookies';

import HTTPError from './httpError';

import refreshByToken from './refreshToken';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;

interface PostRequestData {
  config : AxiosRequestConfig | null;
  method: string | null;
}

const postData:PostRequestData = {
  config: null,
  method: null,
};

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3000',
  timeout: 3600
});

const setAxiosHeaders = (key: string, accessToken: string|null) => {
  axiosInstance.defaults.headers.common[key.toLocaleLowerCase()] = accessToken;
}

/* axios 객체 request 를 가져와 하단 로직 수행 후 flow 재 실행 */
axiosInstance.interceptors.request.use(
  /* request Conifg 작업 */
 (config) => {
   console.log('[axios request Interceptor ... ] ');
   postData.config = config;
   postData.method = config.method!;

   const accessToken: string|undefined = cookie.load('accessToken');
   if(accessToken){
    console.log('accessToken : ',accessToken);
    setAxiosHeaders('accessToken', accessToken);
    const setHeaderedConfig = { ...config , headers: {
      accesstoken: accessToken
    }}

    console.log(setHeaderedConfig);

    return setHeaderedConfig;
   }
   return config
   
 },
 /* request Error 작업 */
 (err) => {
   return err;
 }
)

/* axios 객체 response 를 가져와 하단 로직 수행 후 flow 재 실행 */
axiosInstance.interceptors.response.use(
   /* resonse Conifg 작업 */
  (config) => {
    return config;
  },
 /* resonse Error 작업 */
  async (err) => {
    console.log('[axios response Interceptor ... ]');
    const errorState = err.response.status;

    /* JWT Expierd , 토큰 만료 에러시 리프레쉬 토큰을 사용해 엑세스 토큰 재발급 요청 로직 수행 시작 */
    if(errorState === 402) {
      console.log('[Error : Jwt ExpiredIn ... ]', err.response.status);
      const refreshToken = window.localStorage.getItem('refreshToken');

      /* 리프레쉬 토큰이 로컬 스토리지에 존재 할 경우 */
      if(refreshToken){
        console.log('[Refresh Logic Start ... ]');

        /* 서버에 엑세스, 리프레쉬 토큰 재발급 요청 */
        setAxiosHeaders('refreshToken', refreshToken);
        return axios.get('http://localhost:3000/users/login/refresh',{
          headers: {
            refreshToken : refreshToken
          }
        })
          .then((res) => {
            if(res){

              /* 새로운 엑세스, 리프레쉬 토큰을 통해 axios 및 쿠키, 로컬 스토리지 재설정 */
              const errorMessage = cookie.load('error');
              const reRefreshToken: string = res.data.refreshToken;
              const reAccessToken: string = res.data.accessToken;
              cookie.save('accessToken', reAccessToken, {

              });
              cookie.save('refreshToken', reRefreshToken, {

              });
              cookie.save('error', errorMessage, {})
              cookie.save('kind', 0, {});

              if(reAccessToken && reRefreshToken && res.data){
                console.log('[Success : Refresh by Token ... ]');
                window.localStorage.removeItem('refreshToken');
                window.localStorage.setItem('refreshToken', reRefreshToken);
                
                setAxiosHeaders('accessToken',reAccessToken);

                /* 
                  request interceptor 를 통해 인터셉트한 request 를 재수행 하는 로직 
                  (기존의 request는 402 에러에 의해 사라짐)
                */
                if(postData.config){
                  return axios({
                    ...postData.config,
                    headers: {
                      accesstoken: reAccessToken,
                      isok : true
                    }
                  })
                    .then((res) => {
                      console.log('[excute Intercepted Request ... ]');
                      postData.config = null;
                      postData.method = null;
  
                      return res.data;
                    })
                    .catch((err) => {
                      console.log(err);
                      return new HTTPError(505, '[Error : Somethine Wrong ... ]'); 
                    })
                }
                else{
                  return;
                }
                
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