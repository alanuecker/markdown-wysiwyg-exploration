import React, { forwardRef } from 'react';
import { ReactEditor, useSlateStatic } from 'slate-react';

import { BaseElement, Transforms } from 'slate';
import { CodeLanguageSelect } from '../CodeLanguageSelect';
import classes from './style.module.css';

interface Props {
  element: BaseElement;
  children: React.ReactNode;
}

export const CodeBlock = forwardRef<HTMLDivElement, Props>(
  ({ element, children, ...props }, ref) => {
    const editor = useSlateStatic();

    const setLanguage = (lang: string) => {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, { lang }, { at: path });
    };

    return (
      <div style={{ position: 'relative' }}>
        <CodeLanguageSelect
          value={element.lang || 'text'}
          onChange={setLanguage}
        />
        <pre spellCheck={false} {...props}>
          {children}
        </pre>
      </div>
    );
  },
);
