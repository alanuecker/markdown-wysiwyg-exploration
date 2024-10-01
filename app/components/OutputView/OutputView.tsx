import React, { useMemo } from 'react';

import { getMDXComponent } from 'mdx-bundler/client/index.js';

import classes from './style.module.css';

interface Props {
  data: any;
}

export function OutputView({ data }: Props): React.JSX.Element {
  const Component = useMemo(
    () => getMDXComponent(data.note.code),
    [data.note.code],
  );

  return (
    <div className={classes.root}>
      <h3>Output</h3>
      <Component />
    </div>
  );
}
