import React from 'react';

import * as Toolbar from '@radix-ui/react-toolbar';

import classes from './style.module.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
}

export function ToolbarButton({
  children,
  ...props
}: Props): React.JSX.Element {
  return <Toolbar.Button {...props}>{children}</Toolbar.Button>;
}
