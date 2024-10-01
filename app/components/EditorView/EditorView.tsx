import React from 'react';

import { ClientOnly } from 'remix-utils/client-only';

import { Editor } from '../Editor';

import classes from './style.module.css';

interface Props {
  data: any;
}

export function EditorView({ data }: Props): React.JSX.Element {
  return (
    <div className={classes.root}>
      <h3>Editor</h3>
      <ClientOnly fallback={<p>Loading...</p>}>
        {() => <Editor initialValue={data.note.slateData} />}
      </ClientOnly>
    </div>
  );
}
