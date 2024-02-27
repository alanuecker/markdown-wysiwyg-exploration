import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createEditor, Node } from 'slate';
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import { withHistory } from 'slate-history';
import { Element } from './Element';
import { Leaf } from './Leaf';
import { EditorMarkButton } from '../EditorMarkButton';
import { EditorBlockButton } from '../EditorBlockButton';

type Props = {
  initialValue: Node[];
};

const Editor = forwardRef<Node[], Props>(({ initialValue }, ref) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const [value, setValue] = useState<Node[]>(
    initialValue.length
      ? initialValue
      : [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ],
  );

  ref.current = value;

  // Hack to update value externally
  const [key, setKey] = useState(0);
  useEffect(() => {
    setValue(
      initialValue.length
        ? initialValue
        : [
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ],
    );
    setKey((p) => p + 1);
  }, [initialValue]);

  console.log(initialValue, value);

  return (
    <div>
      <Slate key={key} editor={editor} initialValue={value} onChange={setValue}>
        <div>
          <EditorMarkButton format="strong">format_bold</EditorMarkButton>
          <EditorMarkButton format="emphasis">format_italic</EditorMarkButton>
          <EditorMarkButton format="delete">
            format_delete
          </EditorMarkButton>
          <EditorMarkButton format="code">code</EditorMarkButton>
          {/* todo: change format to heading, depth 1 */}
          <EditorBlockButton format="heading-one">
            format_heading_1
          </EditorBlockButton>
          <EditorBlockButton format="heading-two">
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
          <EditorBlockButton format="left">format_align_left</EditorBlockButton>
          <EditorBlockButton format="center">
            format_align_center
          </EditorBlockButton>
          <EditorBlockButton format="right">
            format_align_right
          </EditorBlockButton>
          <EditorBlockButton format="justify">
            format_align_justify
          </EditorBlockButton>
        </div>
        <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
      </Slate>
    </div>
  );
});

export { Editor };
