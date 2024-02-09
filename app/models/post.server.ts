import type { Post } from '@prisma/client';

import { bundleMDX } from '../utils/mdx.server';
import { prisma } from '../utils/db.server';

export async function getPost({ id }: Pick<Post, 'id'>) {
  const post = await prisma.post.findFirst({
    select: { id: true, content: true, title: true },
    where: { id },
  });

  const { code } = await bundleMDX({ source: post?.content || '' });

  return { ...post, code };
}

export function updatePost({ id, content }: Pick<Post, 'id' | 'content'>) {
  return prisma.post.update({
    data: { content },
    where: { id },
  });
}

export function getPostListItems() {
  return prisma.post.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'desc' },
  });
}

export function createPost({
  content,
  title,
}: Pick<Post, 'content' | 'title'>) {
  return prisma.post.create({
    data: {
      title,
      content,
    },
  });
}

export function deletePost({ id }: Pick<Post, 'id'>) {
  return prisma.post.deleteMany({
    where: { id },
  });
}
