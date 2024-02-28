import { forwardRef, useEffect, useState } from 'react';
import { Descendant, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';
import { EditorBlockButton } from '../EditorBlockButton';
import { EditorMarkButton } from '../EditorMarkButton';
import { SetNodeToDecorations, useDecorate } from '../SetNodeToDecorations';
import { ToolbarCodeBlockButton } from '../ToolbarCodeBlockButton';
import { Element } from './Element';
import { Leaf } from './Leaf';

type Props = {
  initialValue: Descendant[];
};

export const Editor = forwardRef<Descendant[], Props>(
  ({ initialValue }, ref) => {
    const [editor] = useState(() => withHistory(withReact(createEditor())));

    const [value, setValue] = useState<Descendant[]>(initialValue);

    ref.current = value;

    // Hack to update value externally
    const [key, setKey] = useState(0);
    useEffect(() => {
      setValue(initialValue);
      setKey((p) => p + 1);
    }, [initialValue]);

    const decorate = useDecorate(editor);

    return (
      <div>
        <Slate
          key={key}
          editor={editor}
          initialValue={value}
          onChange={setValue}
        >
          <div>
            <EditorMarkButton format="strong">format_bold</EditorMarkButton>
            <EditorMarkButton format="emphasis">format_italic</EditorMarkButton>
            <EditorMarkButton format="delete">format_delete</EditorMarkButton>
            <EditorBlockButton format="heading" depth={1}>
              format_heading_1
            </EditorBlockButton>
            <EditorBlockButton format="heading" depth={2}>
              format_heading_2
            </EditorBlockButton>
            <EditorBlockButton format="block-quote">
              format_quote
            </EditorBlockButton>
            <EditorBlockButton format="numbered-list">
              format_list_numbered
            </EditorBlockButton>
            <EditorBlockButton format="bulleted-list">
              format_list_bulleted
            </EditorBlockButton>
            <EditorBlockButton format="left">
              format_align_left
            </EditorBlockButton>
            <EditorBlockButton format="center">
              format_align_center
            </EditorBlockButton>
            <EditorBlockButton format="right">
              format_align_right
            </EditorBlockButton>
            <EditorBlockButton format="justify">
              format_align_justify
            </EditorBlockButton>
            <ToolbarCodeBlockButton />
          </div>
          <SetNodeToDecorations />
          <Editable
            decorate={decorate}
            renderElement={Element}
            renderLeaf={Leaf}
          />
        </Slate>
      </div>
    );
  },
);
