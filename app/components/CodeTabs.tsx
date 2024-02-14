import { type Editor as TipTapEditor, NodePos } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import React from 'react';

interface Props {
  editor: TipTapEditor;
}

export function CodeTabs(props: Props): React.JSX.Element {
  console.log(props.getPos());
  const pos = new NodePos(props.getPos(), props.editor);
  console.log(props);
  return (
    <>
      <NodeViewWrapper>
        {/* <div>
          <span>Tab 1</span>
          <span>Tab 2</span>
        </div> */}
        <NodeViewContent />
      </NodeViewWrapper>
    </>
  );
}
