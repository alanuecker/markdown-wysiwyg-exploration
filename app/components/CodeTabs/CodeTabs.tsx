import React, { forwardRef, useState } from 'react';

import { Tabs } from '@radix-ui/themes';
import { BaseElement, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { v4 as uuidv4 } from 'uuid';

import { CodeTabsContext } from '../../context/CodeTabsContext';

import classes from './style.module.css';

export interface CodeTabType {
  id: string;
  lang: string;
}

interface Props {
  tabs: CodeTabType[];
  element: BaseElement;
  children: React.ReactNode;
}

export const CodeTabs = forwardRef<HTMLDivElement, Props>(
  ({ tabs, element, children, ...props }, ref) => {
    const editor = useSlateStatic();
    const [activeTab, setActiveTap] = useState(tabs[0].id);

    function handleAddCodeBlock() {
      const path = ReactEditor.findPath(editor, element);

      const id = uuidv4().slice(0, 8);

      Transforms.insertNodes(
        editor,
        {
          id,
          type: 'code',
          lang: 'javascript',
          meta: null,
          children: [
            {
              type: 'code-line',
              children: [
                {
                  text: 'Type here...',
                },
              ],
            },
          ],
        },
        { at: [...path, element.children.length] },
      );

      setActiveTap(id);
    }

    function handleChangeValue(value: string) {
      setActiveTap(value);
    }

    if (tabs.findIndex(({ id }) => id === activeTab) === -1) {
      setActiveTap(tabs[0].id);
    }

    if (!tabs.length) {
      return children;
    }

    return (
      <Tabs.Root
        {...props}
        ref={ref}
        className={classes.root}
        value={activeTab}
        onValueChange={handleChangeValue}
      >
        <Tabs.List contentEditable={false}>
          {tabs.map(({ id }) => (
            <Tabs.Trigger key={id} value={id}>
              {id}
            </Tabs.Trigger>
          ))}
          <Tabs.Trigger onClick={handleAddCodeBlock} value="">
            Add
          </Tabs.Trigger>
        </Tabs.List>
        <CodeTabsContext.Provider value={true}>
          {children}
        </CodeTabsContext.Provider>
      </Tabs.Root>
    );
  },
);

CodeTabs.displayName = 'CodeTabs';
