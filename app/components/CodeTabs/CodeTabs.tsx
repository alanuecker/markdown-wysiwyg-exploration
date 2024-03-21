import React, { forwardRef, useState } from 'react';

import { Tabs } from '@radix-ui/themes';
import { BaseElement, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { v4 as uuidv4 } from 'uuid';

import { CodeTabsContext } from '../../context/CodeTabsContext';

import classes from './style.module.scss';

interface Tab {
  id: string;
  lang: string;
}

interface Props {
  element: BaseElement;
  children: React.ReactNode;
}

export const CodeTabs = forwardRef<HTMLDivElement, Props>(
  ({ element, children, ...props }, ref) => {
    const editor = useSlateStatic();
    const [tabs, setTabs] = useState<Tab[]>([]);

    function addCodeBlock(defaultLanguage: string): string {
      const id = uuidv4().slice(0, 8);
      setTabs(val => [...val, { id: id, lang: defaultLanguage }]);

      return id;
    }

    function removeCodeBlock(tabId: string): void {
      setTabs(val => val.filter(({ id }) => id !== tabId));
    }

    function handleAddCodeBlock() {
      const path = ReactEditor.findPath(editor, element);
      Transforms.insertNodes(
        editor,
        {
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
    }

    return (
      <Tabs.Root
        {...props}
        ref={ref}
        className={classes.root}
        defaultValue={tabs[0]?.id}
      >
        <Tabs.List className="TabsList" contentEditable={false}>
          {!!tabs.length &&
            tabs.map(({ id }) => (
              <Tabs.Trigger key={id} className="TabsTrigger" value={id}>
                {id}
              </Tabs.Trigger>
            ))}
          <Tabs.Trigger onClick={handleAddCodeBlock} value="">
            Add
          </Tabs.Trigger>
        </Tabs.List>
        <CodeTabsContext.Provider value={{ addCodeBlock, removeCodeBlock }}>
          {children}
        </CodeTabsContext.Provider>
      </Tabs.Root>
    );
  },
);

CodeTabs.displayName = 'CodeTabs';
