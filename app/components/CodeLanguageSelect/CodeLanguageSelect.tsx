import React from 'react';

import classes from './style.module.css';

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
    <select
      {...props}
      value={value}
      contentEditable={false}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="css">CSS</option>
      <option value="html">HTML</option>
      <option value="java">Java</option>
      <option value="javascript">JavaScript</option>
      <option value="jsx">JSX</option>
      <option value="markdown">Markdown</option>
      <option value="php">PHP</option>
      <option value="python">Python</option>
      <option value="sql">SQL</option>
      <option value="tsx">TSX</option>
      <option value="typescript">TypeScript</option>
    </select>
  );
}
