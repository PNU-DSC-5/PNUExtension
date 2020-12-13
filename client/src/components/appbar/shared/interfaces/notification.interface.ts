export interface Notification {
  _index: number;
  title: string;
  userId: string;
  content: string;
  createdAt: Date;
  noticeAt: Date;

  isRead: boolean;
  isImportant: boolean;
  isRemoved: boolean;
}