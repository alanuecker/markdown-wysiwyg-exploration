import React from 'react';

import classes from './style.module.css';
import { useSlate } from 'slate-react';
import classNames from 'classnames';
import { BaseEditor, Editor, Element as SlateElement, Transforms } from 'slate';
import { LIST_TYPES, TEXT_ALIGN_TYPES } from '../Editor';

const isBlockActive = (
  editor: BaseEditor,
  format: string,
  blockType = 'type',
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    }),
  );

  return !!match;
};

const toggleBlock = (editor: BaseEditor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

interface Props {
  format: string;
  depth?: number;
  children: string;
}

export function EditorBlockButton({
  format,
  children,
}: Props): React.JSX.Element {
  const editor = useSlate();

  return (
    <button
      type="button"
      className={classNames({
        [classes.active]: isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
        ),
      })}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {children}
    </button>
  );
}
