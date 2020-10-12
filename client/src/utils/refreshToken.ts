import axios from 'axios';

export default function refreshByToken(refreshToken: string) {
  return axios.get<string, boolean>('http://localhost:3000/users/login/refresh',{
    headers: {
      refreshtoken : refreshToken
    }
  });
}

