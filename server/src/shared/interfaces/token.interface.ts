import { Url } from './user.interface';

export interface Payload {
  name: string;
  picture: string;
  email: string;
  roles: 'user' | 'admin';
  id: string;
  url: Url[];
}

export interface Token {
  readonly accessToken : string;
  readonly refreshToken : string;
}

