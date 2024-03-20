import React from 'react';

import { Select } from '@radix-ui/themes';

import classes from './style.module.scss';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function CodeLanguageSelect({
  value,
  onChange,
  ...props
}: Props): React.JSX.Element {
  return (
    <Select.Root
      {...props}
      value={value}
      contentEditable={false}
      onChange={e => onChange(e.target.value)}
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="css">CSS</Select.Item>
        <Select.Item value="html">HTML</Select.Item>
        <Select.Item value="java">Java</Select.Item>
        <Select.Item value="javascript">JavaScript</Select.Item>
        <Select.Item value="jsx">JSX</Select.Item>
        <Select.Item value="markdown">Markdown</Select.Item>
        <Select.Item value="php">PHP</Select.Item>
        <Select.Item value="python">Python</Select.Item>
        <Select.Item value="sql">SQL</Select.Item>
        <Select.Item value="tsx">TSX</Select.Item>
        <Select.Item value="typescript">TypeScript</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
