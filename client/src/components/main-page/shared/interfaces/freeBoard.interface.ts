export interface FreeBoard {
  _index: number;
  title: string;
  userName: string;
  userId: string;
  content: string;
  createdAt: Date;
  likes: number;
  views: number;
  category: string;
  tag: string;
  isSecret: boolean;
}
