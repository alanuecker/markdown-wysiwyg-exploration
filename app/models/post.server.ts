import type { Post } from '@prisma/client';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypeSlug from 'rehype-slug';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import { prisma } from '../utils/db.server';
import { bundleMDX } from '../utils/mdx.server';

import { h } from 'hastscript';
import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';

function myRemarkPlugin() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== 'callout') return;

        const data = node.data || (node.data = {});
        const tagName = node.type === 'textDirective' ? 'span' : 'div';

        data.hName = tagName;
        data.hProperties = h(tagName, node.attributes || {}).properties;
      }
    });
  };
}

export async function getPost({ id }: Pick<Post, 'id'>) {
  const post = await prisma.post.findFirst({
    select: { id: true, content: true, title: true },
    where: { id },
  });

  const { code } = await bundleMDX({
    source: post?.content || '',
    mdxOptions(options, frontmatter) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
        remarkDirective,
        myRemarkPlugin,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypePresetMinify,
      ];

      return options;
    },
  });

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
