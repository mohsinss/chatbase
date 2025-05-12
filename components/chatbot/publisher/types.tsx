export interface Post {
    id: string;
    title: string;
    content: string;
    status: 'scheduled' | 'draft' | 'published';
    date: string;
  }