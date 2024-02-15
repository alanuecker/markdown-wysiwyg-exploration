
import { useState } from 'react';
import { createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';

interface Props {
  editorRef: any;
  markdown: string;
}

export function Editor({ editorRef, markdown }: Props): React.JSX.Element {
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <>
      <Slate editor={editor} initialValue={markdown}>
        <Editable />
      </Slate>
      <hr />
    </>
  );
}
