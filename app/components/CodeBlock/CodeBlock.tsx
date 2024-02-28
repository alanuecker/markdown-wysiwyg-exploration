import React, { forwardRef } from 'react';
import { ReactEditor, useSlateStatic } from 'slate-react';

import { BaseElement, Transforms } from 'slate';
import { CodeLanguageSelect } from '../CodeLanguageSelect';
import classes from './style.module.css';

interface Props {
  element: BaseElement;
  children: React.ReactNode;
}

export const CodeBlock = forwardRef<any, Props>(
  ({ element, children, ...props }, ref) => {
    const editor = useSlateStatic();

    const setLanguage = (value: string) => {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, { lang: value }, { at: path });
    };

    return (
      <div
        {...props}
        ref={ref}
        style={{ position: 'relative', border: '1px solid black' }}
      >
        <CodeLanguageSelect value={element.lang} onChange={setLanguage} />
        <pre>{children}</pre>
      </div>
    );
  },
);
