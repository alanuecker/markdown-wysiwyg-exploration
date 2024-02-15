import * as Tabs from '@radix-ui/react-tabs';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CodeTabsContext,
  type CodeTabsContextType,
} from '../../context/CodeTabsContext';

interface Props {
  children: React.ReactNode;
}

export function CodeTabs({ children }: Props): React.JSX.Element {
  const [tabs, setTabs] = useState({});

  const initCodeBlock: CodeTabsContextType = (defaultLanguage) => {
    const id = uuidv4().slice(0, 8);
    setTabs({ ...tabs, id: { defaultLanguage } });

    return id;
  };

  console.log(tabs);

  return (
    <CodeTabsContext.Provider value={initCodeBlock}>
      <Tabs.Root className="TabsRoot" defaultValue="tab1">
        <Tabs.List className="TabsList" aria-label="Manage your account">
          <Tabs.Trigger className="TabsTrigger" value="tab1">
            Account
          </Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="tab2">
            Password
          </Tabs.Trigger>
        </Tabs.List>
        {children}
      </Tabs.Root>
    </CodeTabsContext.Provider>
  );
}
