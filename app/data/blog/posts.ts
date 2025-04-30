import postsData from './posts.json';

export interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  relatedPosts: {
    id: string;
    title: string;
    image: string;
  }[];
}

export interface BlogPosts {
  [key: string]: BlogPost;
}

export const blogPosts: BlogPosts = postsData; 