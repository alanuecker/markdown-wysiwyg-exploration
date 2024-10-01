import React from 'react';

import { Element as SlateElement, Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';

import { ToolbarButton } from '../ToolbarButton';

export function ToolbarCodeBlockButton(): React.JSX.Element {
  const editor = useSlateStatic();

  const handleClick = () => {
    Transforms.wrapNodes(
      editor,
      { type: 'code', lang: 'javascript', children: [] },
      {
        match: n => SlateElement.isElement(n) && n.type === 'paragraph',
        split: true,
      },
    );
    Transforms.setNodes(
      editor,
      { type: 'code-line' },
      { match: n => SlateElement.isElement(n) && n.type === 'paragraph' },
    );
  };

  return (
    <ToolbarButton
      type="button"
      onClick={event => {
        event.preventDefault();
        handleClick();
      }}
    >
      Code
    </ToolbarButton>
  );
}
