import * as Tabs from '@radix-ui/react-tabs';
import React, { useContext, useEffect, useState } from 'react';
import { CodeTabsContext } from '../../context/CodeTabsContext';

interface Props {
  children: React.ReactHTML;
}

export function CodeTab({ attributes, children }: Props): React.JSX.Element {
  const [value, setValue] = useState<string>();
  const initCodeBlock = useContext(CodeTabsContext);

  const defaultLanguage = 'txt';

  useEffect(() => {
    if (initCodeBlock) {
      console.log('init code block');
      const tabValue = initCodeBlock(defaultLanguage);
      setValue(tabValue);
    }
  }, [initCodeBlock]);

  const Component = value ? Tabs.Content : 'div';

  return (
    <Component {...attributes} value={value}>
      <pre>
        <code>{children}</code>
      </pre>
    </Component>
  );
}
