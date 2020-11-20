export interface Url {
  name: string;
  url: string;
  index: number;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
  url: Url[];
  kind: 'local' | 'github' | 'google' | 'facebook' | 'kakao' | 'naver';
  uuid?: string;
  refresh?: string;
}