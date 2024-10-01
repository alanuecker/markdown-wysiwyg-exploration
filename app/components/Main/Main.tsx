import React from 'react';

import classes from './style.module.css';

interface Props {}

export function Main({ children }: Props): React.JSX.Element {
  return <main className={classes.root}>{children}</main>;
}
