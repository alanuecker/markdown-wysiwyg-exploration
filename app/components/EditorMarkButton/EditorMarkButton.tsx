import React from 'react';

import classes from './style.module.css';
import { useSlate } from 'slate-react';
import { Editor } from 'slate';
import classNames from 'classnames';

interface Props {
  format: string;
  children: string;
}

export function EditorMarkButton({
  format,
  children,
}: Props): React.JSX.Element {
  const editor = useSlate();

  const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  return (
    <button
      type="button"
      className={classNames({ [classes.active]: isMarkActive(editor, format) })}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </button>
  );
}
