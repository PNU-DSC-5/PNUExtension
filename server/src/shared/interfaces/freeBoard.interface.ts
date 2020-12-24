export interface FreeBoard {
  _index: number;
  title: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  likes: number;
  views: number;
  category: string;
  tag: string;
  isSecret: boolean;
}
