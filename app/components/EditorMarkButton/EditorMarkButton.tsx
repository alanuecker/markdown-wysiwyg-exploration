import React from 'react';

import classNames from 'classnames';
import { BaseEditor, Editor } from 'slate';
import { useSlate } from 'slate-react';

import classes from './style.module.scss';

const isMarkActive = (editor: BaseEditor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: BaseEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

interface Props {
  format: string;
  children: string;
}

export function EditorMarkButton({
  format,
  children,
}: Props): React.JSX.Element {
  const editor = useSlate();

  return (
    <button
      type="button"
      className={classNames({ [classes.active]: isMarkActive(editor, format) })}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </button>
  );
}
