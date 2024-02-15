import * as Tabs from '@radix-ui/react-tabs';
import {
  NodeViewContent,
  type NodeViewProps,
  NodeViewWrapper,
} from '@tiptap/react';
import React, { useContext, useEffect, useState } from 'react';
import { CodeTabsContext } from '../../context/CodeTabsContext';

interface Props extends NodeViewProps {}

export function CodeTab({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}: Props): React.JSX.Element {
  const [value, setValue] = useState<string>();
  // todo: does not work in TipTap since ReactRenderers are portals and ths this is not a child of CodeTabs  
  const initCodeBlock = useContext(CodeTabsContext);

  useEffect(() => {
    console.log('use effect', initCodeBlock);
    if (initCodeBlock) {
      console.log('init code block');
      const tabValue = initCodeBlock(defaultLanguage, updateAttributes);
      setValue(tabValue);
    }
  }, [defaultLanguage, initCodeBlock, updateAttributes]);

  return (
    <NodeViewWrapper as={initCodeBlock ? Tabs.Content : 'div'} value={value}>
      <select
        contentEditable={false}
        defaultValue={defaultLanguage}
        onChange={(event) => updateAttributes({ language: event.target.value })}
      >
        <option value="null">auto</option>
        <option disabled>—</option>
        {extension.options.lowlight.listLanguages().map((lang, index) => (
          <option key={index} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
