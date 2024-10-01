import React from 'react';

import classes from './style.module.css';

interface Props {}

export function Body({ children }: Props): React.JSX.Element {
  return <div className={classes.root}>{children}</div>;
}
