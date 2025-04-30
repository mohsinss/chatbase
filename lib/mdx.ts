import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import rehypePrism from 'rehype-prism-plus'
import remarkGfm from 'remark-gfm'
import React from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  authorRole: string
  image: string
  category: string
  readTime: string
  tags: string[]
  relatedPosts: string[]
  content: string
  mdxSource?: any
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data: frontMatter, content } = matter(fileContents)

    const mdxSource = await serialize(content, {
      mdxOptions: {
        rehypePlugins: [rehypePrism],
        remarkPlugins: [remarkGfm],
      },
      scope: frontMatter,
    })

    return {
      slug,
      title: frontMatter.title,
      excerpt: frontMatter.excerpt,
      date: frontMatter.date,
      author: frontMatter.author,
      authorRole: frontMatter.authorRole,
      image: frontMatter.image,
      category: frontMatter.category,
      readTime: frontMatter.readTime,
      tags: frontMatter.tags,
      relatedPosts: frontMatter.relatedPosts,
      content: mdxSource,
    }
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error)
    return null
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const files = fs.readdirSync(BLOG_DIR)
  const posts = await Promise.all(
    files
      .filter(file => file.endsWith('.mdx'))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, '')
        const post = await getBlogPost(slug)
        return post
      })
  )
  
  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function MDXContent({ source }: { source: MDXRemoteSerializeResult }) {
  return <MDXRemote {...source} />
}