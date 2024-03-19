import React from 'react';
import { Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';

export function ToolbarTabsButton(): React.JSX.Element {
  const editor = useSlateStatic();

  const handleClick = () => {
    Transforms.insertNodes(editor, {
      type: 'containerDirective',
      name: 'code-tabs',
      children: [
        {
          type: 'code',
          lang: 'javascript',
          meta: null,
          children: [
            {
              type: 'code-line',
              children: [
                {
                  text: 'Type here...',
                },
              ],
            },
          ],
        },
        {
          type: 'code',
          lang: 'typescript',
          meta: null,
          children: [
            {
              type: 'code-line',
              children: [
                {
                  text: 'Type here...',
                },
              ],
            },
          ],
        },
      ],
    });
  };

  return (
    <button
      type="button"
      onMouseDown={(event) => {
        event.preventDefault();
        handleClick();
      }}
    >
      Tabs
    </button>
  );
}
