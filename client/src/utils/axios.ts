  
import axios from 'axios';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3003',
});

const setAxiosHeaders = (accessToken: string|null) => {
  axiosInstance.defaults.headers.common['accessToken'] = accessToken;
}

axiosInstance.interceptors.request.use(
 (config) => {
   return config;
 },

 (err) => {
   return err;
 }
)

axiosInstance.interceptors.response.use(
  (config) => {
    console.log(config);
    if(config.status === 401){
      console.log('401!!!!')
    }
    else if(config.status === 500){
      console.log('500!!!!')
    }

    return config;
  },
 
  (err) => {
    console.log(err.status);
    return err;
  }
 )

export default { 
  axiosInstance,
  setAxiosHeaders
}