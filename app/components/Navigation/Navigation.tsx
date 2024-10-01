import React from 'react';

import classes from './style.module.css';

interface Props {}

export function Navigation({ children }: Props): React.JSX.Element {
  return <aside className={classes.root}>{children}</aside>;
}
