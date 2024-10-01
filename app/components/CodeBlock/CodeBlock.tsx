import React, { forwardRef, useContext } from 'react';

import { Button, Tabs } from '@radix-ui/themes';
import { BaseElement, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';

import { CodeTabsContext } from '../../context/CodeTabsContext';
import { CodeLanguageSelect } from '../CodeLanguageSelect';

interface Props {
  element: BaseElement;
  children: React.ReactNode;
}

export const CodeBlock = forwardRef<HTMLDivElement, Props>(
  ({ element, children, ...props }, ref) => {
    const editor = useSlateStatic();
    const isChildInTabs = useContext(CodeTabsContext);

    const Component = isChildInTabs ? Tabs.Content : 'div';

    const setLanguage = (lang: string) => {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, { lang }, { at: path });
    };

    function handleDelete() {
      const path = ReactEditor.findPath(editor, element);

      Transforms.removeNodes(editor, { at: path });
    }

    return (
      <Component ref={ref} style={{ position: 'relative' }} value={element.id}>
        <div contentEditable={false}>
          <CodeLanguageSelect
            value={element.lang || 'text'}
            onChange={setLanguage}
          />
          {element.id && <Button onClick={handleDelete}>Delete</Button>}
        </div>
        <pre {...props}>{children}</pre>
      </Component>
    );
  },
);

CodeBlock.displayName = 'CodeBlock';
