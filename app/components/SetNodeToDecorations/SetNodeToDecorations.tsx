import { useCallback } from 'react';

import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';

import {
  Descendant,
  Editor,
  Element as SlateElement,
  Node,
  NodeEntry,
  Range,
} from 'slate';
import { useSlate } from 'slate-react';

import { normalizeTokens } from './normalizeTokens';

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
  'html',
  'css',
  'markdown',
  'shell',
  'html',
];

// Use decorate to highlight the code blocks.
export const useDecorate = (
  editor: Editor,
): (([node, path]: NodeEntry) => Range[]) => {
  return useCallback(
    ([node]) => {
      if (SlateElement.isElement(node) && node.type === 'code-line') {
        const ranges = editor.nodeToDecorations.get(node) || [];
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
      ? block.lang
      : 'text'
    : 'text';

  if (language === 'text') {
    return nodeToDecorations;
  }

  const codeText = block.children.map(line => Node.string(line)).join('\n');

  const tokens = Prism.tokenize(codeText, Prism.languages[language]);
  const normalizedTokens = normalizeTokens(tokens); // make tokens flat and grouped by line
  const blockChildren = block.children as SlateElement[];

  for (let index = 0; index < normalizedTokens.length; index++) {
    const lineTokens = normalizedTokens[index];
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
        token: true,
        ...Object.fromEntries(token.types.map(type => [type, true])),
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
  );

  const nodeToDecorations = mergeMaps(
    ...blockEntries.map(getChildNodeToDecorations),
  );

  editor.nodeToDecorations = nodeToDecorations;

  return null;
}
