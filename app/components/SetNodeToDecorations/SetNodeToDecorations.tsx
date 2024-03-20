import { useCallback } from 'react';

import { BundledLanguage, getHighlighter } from 'shiki';
import {
  Descendant,
  Editor,
  Element as SlateElement,
  Node,
  NodeEntry,
  Range,
} from 'slate';
import { useSlate } from 'slate-react';

export type CodeElement = {
  type: 'code';
  children: Descendant[];
  lang?: string;
};

// Represent each line in CodeElement
export type CodeLineElement = {
  type: 'code-line';
  children: Descendant[];
  num?: number;
};

const supportedLanguages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'html',
  'css',
  'markdown',
  'shell',
];

const highlighter = await getHighlighter({
  themes: ['github-light'],
  langs: supportedLanguages,
});

// Use decorate to highlight the code blocks.
export const useDecorate = (
  editor: Editor,
): (([node, path]: NodeEntry) => Range[]) => {
  return useCallback(
    ([node]) => {
      if (SlateElement.isElement(node) && node.type === 'code-line') {
        const ranges = editor.nodeToDecorations?.get(node) || [];
        return ranges;
      }

      return [];
    },
    [editor.nodeToDecorations],
  );
};

const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
  const map = new Map<K, V>();

  for (const m of maps) {
    for (const item of m) {
      map.set(...item);
    }
  }

  return map;
};

const getChildNodeToDecorations = ([
  block,
  blockPath,
]: NodeEntry<CodeElement>) => {
  const nodeToDecorations = new Map<SlateElement, Range[]>();

  const language = block.lang
    ? supportedLanguages.includes(block.lang)
      ? (block.lang as BundledLanguage)
      : 'text'
    : 'text';

  if (language === 'text') {
    return nodeToDecorations;
  }

  const codeText = block.children.map(line => Node.string(line)).join('\n');
  const themedTokens = highlighter.codeToTokens(codeText, {
    lang: language,
    theme: 'github-light',
  });

  const blockChildren = block.children as SlateElement[];

  const { tokens } = themedTokens;

  for (let index = 0; index < tokens.length; index++) {
    const lineTokens = tokens[index];
    const element = blockChildren[index];
    if (!nodeToDecorations.has(element)) {
      nodeToDecorations.set(element, []);
    }

    let start = 0;
    for (const token of lineTokens) {
      const length = token.content.length;
      if (!length) {
        continue;
      }

      const end = start + length;

      const path = [...blockPath, index, 0];
      const range = {
        anchor: { path, offset: start },
        focus: { path, offset: end },
        color: token.color,
      };
      nodeToDecorations.get(element)!.push(range);

      start = end;
    }
  }

  return nodeToDecorations;
};

// precalculate editor.nodeToDecorations map to use it inside decorate function then
export function SetNodeToDecorations() {
  const editor = useSlate();

  const blockEntries = Array.from(
    Editor.nodes(editor, {
      at: [],
      mode: 'highest',
      match: n => SlateElement.isElement(n) && n.type === 'code',
    }),
  ) as NodeEntry<CodeElement>[];

  const nodeToDecorations: Map<SlateElement, Range[]> = mergeMaps(
    ...blockEntries.map(getChildNodeToDecorations),
  );

  editor.nodeToDecorations = nodeToDecorations;

  return null;
}
