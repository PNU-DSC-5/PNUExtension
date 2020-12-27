import axios, { AxiosRequestConfig } from 'axios';
// cookie
import cookie from 'react-cookies';

import HTTPError from './httpError';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;

interface PostRequestData {
  config: AxiosRequestConfig | null;
  method: string | null;
}

const postData: PostRequestData = {
  config: null,
  method: null,
};

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'https://back-dot-pnuextension.dt.r.appspot.com',
  timeout: 3600,
  // headers: {
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  //   'Access-Control-Allow-Headers': 'authorization, Origin, X-Requested-With, Content-Type, Accept',
  // },
});

const setAxiosHeaders = (key: string, accessToken: string|null): void => {
  axiosInstance.defaults.headers.common[key.toLocaleLowerCase()] = accessToken;
};

// setAxiosHeaders('Access-Control-Allow-Origin', '*');
// setAxiosHeaders('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
// setAxiosHeaders('Access-Control-Allow-Headers', 'authorization, Origin, X-Requested-With, Content-Type, Accept');

/* axios 객체 request 를 가져와 하단 로직 수행 후 flow 재 실행 */
axiosInstance.interceptors.request.use(
  /* 
    request Conifg 작업 
    JWT Expeired or Unauthorization Error 로 인해 날라간 요청을
    자동으로 재수행하기 위한 사전작업
  */
  (config) => {
    console.log('[axios request Interceptor ... ] ');
    postData.config = config;
    postData.method = config.method!;

    /* AccessToken 헤더 첨부 */
    const accessToken: string|undefined = cookie.load('accessToken');
    if (accessToken) {
      setAxiosHeaders('accessToken', accessToken);
      const setHeaderedConfig = {
        ...config,
        headers: {
          accesstoken: accessToken,
        },
      };
      return setHeaderedConfig;
    }
    return config;
  },
  /* request Error 작업 */
  (err) => {
    console.log('[axios request Interceptor ... ] : Error ');
    return err;
  },
);

/* axios 객체 response 를 가져와 하단 로직 수행 후 flow 재 실행 */
axiosInstance.interceptors.response.use(
  /* resonse Conifg 작업 */
  (config) => config,
  /* resonse Error 작업 */
  async (err) => {
    console.log('[axios response Interceptor ... ]');

    if (err.response) {
      const errorState = err.response.status;

      /* JWT Expierd , 토큰 만료 에러시 리프레쉬 토큰을 사용해 엑세스 토큰 재발급 요청 로직 수행 시작 */
      if (errorState === 402) {
        console.log('[Error : Jwt ExpiredIn ... ]', err.response.status);

        /* uuid(고유식별자) 가 로컬 스토리지에 존재 하지 않는 경우 , 재로그인 필요 */
        const uuid = window.localStorage.getItem('uuid');
        const refreshToken = cookie.load('refreshToken');
        console.log('[UUID ... ]', uuid);
        if (!uuid && !refreshToken) {
          console.log('[Empty UUID, Reject Auto Login ... ]');
          return err;
        }

        /* uuid(고유식별자) 가 로컬 스토리지에 존재 하는 경우 , 자동 토큰 재발급 및 재요청 수행 로직 시작 */
        if (refreshToken) {
          console.log('[Refresh Logic Start ... ]');

          /* 서버에 엑세스, 리프레쉬 토큰 재발급 요청 */
          setAxiosHeaders('refreshToken', refreshToken);
          return axios.get('https://back-dot-pnuextension.dt.r.appspot.com/users/login/refresh', {
            headers: {
              refreshToken,
            },
          })
            .then((res) => {
              if (res) {
                /* 새로운 엑세스, 리프레쉬 토큰을 통해 axios 및 쿠키, 로컬 스토리지 재설정 */
                const reRefreshToken: string = res.data.refreshToken;
                const reAccessToken: string = res.data.accessToken;

                cookie.remove('accessToken');
                cookie.remove('refreshToken');

                cookie.save('accessToken', reAccessToken, {});
                cookie.save('refreshToken', reRefreshToken, {});

                if (reAccessToken && reRefreshToken && res.data) {
                  console.log('[Success : Refresh by Token ... ]');
                  setAxiosHeaders('accessToken', reAccessToken);

                  /* 
                    request interceptor 를 통해 인터셉트한 request 를 재수행 하는 로직 
                    (기존의 request는 402 에러에 의해 사라짐)
                  */
                  if (postData.config) {
                    return axios({
                      ...postData.config,
                      headers: {
                        accesstoken: reAccessToken,
                        isok: true,
                      },
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
                      });
                  }
                } else {
                  console.log('refresh fail', res);
                  throw new HTTPError(401, '[Error : Refresh by Token ... ]');
                }
              }
            })
            .catch((err) => {
              console.log('[Error : Refresh by Token ... ]', err);
              return new HTTPError(401, '[Error : Refresh by Token ... ]');
            });
        }

        // throw new HTTPError(401, '[Error : Refresh by Token ... ]');
      }
    }

    return err;
  },
);

export default {
  axiosInstance,
  setAxiosHeaders,
};
