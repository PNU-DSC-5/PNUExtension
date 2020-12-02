export interface FreeBoardPost {
  title: string;
  content: string;
  createdAt: Date;
  likes: number;
  views: number;
  CheckValidateNewClass: number;
  category?: string;
  tag?: string;
}
