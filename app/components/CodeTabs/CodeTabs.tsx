import * as Tabs from '@radix-ui/react-tabs';
import {
  NodeViewContent,
  type NodeViewProps,
  NodeViewWrapper,
} from '@tiptap/react';
import React, { useState } from 'react';
import {
  CodeTabsContext,
  type CodeTabsContextType,
} from '../../context/CodeTabsContext';
import { generateUID } from '../../utils/generateUUID';

interface Props extends NodeViewProps {}

export function CodeTabs(props: Props): React.JSX.Element {
  const [tabs, setTabs] = useState({});

  const initCodeBlock: CodeTabsContextType = (
    defaultLanguage,
    updateAttributes,
  ) => {
    const id = generateUID();
    setTabs({ ...tabs, id: { defaultLanguage, updateAttributes } });

    return id;
  };

  console.log(tabs);

  return (
    <CodeTabsContext.Provider value={initCodeBlock}>
      <NodeViewWrapper as={Tabs.Root} className="TabsRoot" defaultValue="tab1">
        <Tabs.List className="TabsList" aria-label="Manage your account">
          <Tabs.Trigger className="TabsTrigger" value="tab1">
            Account
          </Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="tab2">
            Password
          </Tabs.Trigger>
        </Tabs.List>
        <NodeViewContent />
      </NodeViewWrapper>
    </CodeTabsContext.Provider>
  );
}
