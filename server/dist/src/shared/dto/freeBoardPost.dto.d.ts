export interface FreeBoardPost {
    title: string;
    content: string;
    createdAt: Date;
    likes: number;
    views: number;
    category?: string;
    tag?: string;
    isSecret: boolean;
}
