import {
  NodeViewContent,
  type NodeViewProps,
  NodeViewWrapper,
} from '@tiptap/react';
import React from 'react';

interface Props extends NodeViewProps {}

export function CodeTabs(props: Props): React.JSX.Element {
  return (
    <NodeViewWrapper>
      {/* <div>
          <span>Tab 1</span>
          <span>Tab 2</span>
        </div> */}
      <NodeViewContent />
    </NodeViewWrapper>
  );
}
