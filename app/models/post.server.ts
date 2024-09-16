import type { Post } from '@prisma/client';
import { h } from 'hastscript';
import type { Root } from 'mdast';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypeSlug from 'rehype-slug';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import markdown from 'remark-parse';
import { remarkToSlate, slateToRemark } from 'remark-slate-transformer';
import stringify from 'remark-stringify';
import { Descendant } from 'slate';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from '../utils/db.server';
import { bundleMDX } from '../utils/mdx.server';

function myRemarkPlugin() {
  return (tree: Root) => {
    visit(tree, node => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== 'codeTabs') return;

        const data = node.data || (node.data = {});
        const tagName = node.type === 'textDirective' ? 'span' : 'div';

        data.hName = tagName;
        data.hProperties = h(tagName, node.attributes || {}).properties;
      }
    });
  };
}

function parseRemarkCodeLineToSlate(entry) {
  if (entry.type === 'code') {
    return {
      id: uuidv4().slice(0, 8),
      ...entry,
      children: entry.children[0].text
        .split('\n')
        .map(line => ({ type: 'code-line', children: [{ text: line }] })),
    };
  }

  if (entry.children.some(({ type }) => type === 'code')) {
    entry.children = entry.children.map(parseRemarkCodeLineToSlate);
  }

  return entry;
}

export async function getPost({ id }: Pick<Post, 'id'>) {
  const post = await prisma.post.findFirst({
    select: { id: true, content: true, title: true },
    where: { id },
  });

  const { code } = await bundleMDX({
    source: post?.content || '',
    mdxOptions(options) {
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

  const processor = unified()
    .use(markdown)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkToSlate);

  const slateData = processor.processSync(post?.content || '').result;

  const cleanedSlateData = slateData.map(parseRemarkCodeLineToSlate);

  return { ...post, code, slateData: cleanedSlateData };
}

function parseSlateCodeLineToRemark(entry: Descendant) {
  if (entry.type === 'code') {
    /**
     * Node structure
     * - code
     * - children
     *   - code-line
     *   - children
     *     - text
     */

    const { type, children, ...rest } = entry;

    const text = children
      .map(line => {
        if (line.type === 'code-line') {
          return line.children?.map(child => child.text);
        }
        if (line.text) {
          return line.text;
        }
        return undefined;
      })
      .filter(Boolean)
      .join('\n');

    return {
      type,
      children: [{ text }],
      ...rest,
    };
  }

  if (entry.children.some(({ type }) => type === 'code')) {
    entry.children = entry.children.map(parseSlateCodeLineToRemark);
  }

  return entry;
}

export function updatePost({ id, content }: Pick<Post, 'id' | 'content'>) {
  const processor = unified()
    .use(remarkGfm)
    .use(remarkDirective)
    .use(stringify);

  if (!content || !JSON.parse(content)) {
    return prisma.post.update({
      data: { content },
      where: { id },
    });
  }

  const cleanedContent = JSON.parse(content).map(
    parseSlateCodeLineToRemark,
    [],
  );

  const ast = processor.runSync(slateToRemark(cleanedContent));
  const text = processor.stringify(ast);

  return prisma.post.update({
    data: { content: text },
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
