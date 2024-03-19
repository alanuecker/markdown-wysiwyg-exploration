import * as Tabs from '@radix-ui/react-tabs';
import React, { forwardRef, useState } from 'react';
import { BaseElement } from 'slate';
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
  ({ element, children }, ref) => {
    const [tabs, setTabs] = useState<Tab[]>([]);

    function addCodeBlock(defaultLanguage: string): string {
      const id = uuidv4().slice(0, 8);
      setTabs((val) => [...val, { id: id, lang: defaultLanguage }]);

      console.log('asign', defaultLanguage, id);

      return id;
    }

    function removeCodeBlock(tabId: string): void {
      setTabs((val) => val.filter(({ id }) => id !== tabId));
    }

    console.log(tabs);

    return (
      <CodeTabsContext.Provider value={{ addCodeBlock, removeCodeBlock }}>
        <Tabs.Root
          ref={ref}
          className={classes.root}
          defaultValue={tabs[0]?.id}
        >
          <Tabs.List className="TabsList" contentEditable={false}>
            {!!tabs.length &&
              tabs.map(({ id, lang }) => (
                <Tabs.Trigger
                  key={`${id}-${lang}`}
                  className="TabsTrigger"
                  value={id}
                >
                  {`${id}-${lang}`}
                </Tabs.Trigger>
              ))}
          </Tabs.List>
          {children}
        </Tabs.Root>
      </CodeTabsContext.Provider>
    );
  },
);

CodeTabs.displayName = 'CodeTabs';
