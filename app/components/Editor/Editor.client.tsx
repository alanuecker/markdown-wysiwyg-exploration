import { useEffect, useState } from 'react';

import { Descendant, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';

import { SetNodeToDecorations, useDecorate } from '../SetNodeToDecorations';
import { EditorToolbar } from '../EditorToolbar';

import { Element } from './Element';
import { Leaf } from './Leaf';
import classes from './style.module.css';

type Props = {
  initialValue: Descendant[];
};

export function Editor({ initialValue }: Props) {
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  const [value, setValue] = useState<Descendant[]>(initialValue);

  // Hack to update value externally
  const [key, setKey] = useState(0);
  useEffect(() => {
    setValue(initialValue);
    setKey(p => p + 1);
  }, [initialValue]);

  const decorate = useDecorate(editor);

  return (
    <div className={classes.root}>
      <Slate key={key} editor={editor} initialValue={value} onChange={setValue}>
        <EditorToolbar value={value} />
        <SetNodeToDecorations />
        <Editable
          className={classes.editable}
          decorate={decorate}
          renderElement={Element}
          renderLeaf={Leaf}
        />
      </Slate>
    </div>
  );
}
