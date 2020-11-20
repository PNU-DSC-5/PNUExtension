import { Url } from './user.interface';

export interface Payload {
  name: string | null;
  picture: string | null;
  email: string | null;
  roles: 'user' | 'admin';
  id: string | null;
  url: Url[];
}

export interface Token {
  readonly accessToken: string;
  readonly refreshToken: string;
}
