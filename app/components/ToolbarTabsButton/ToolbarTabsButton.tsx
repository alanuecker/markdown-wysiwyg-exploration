import React from 'react';
import { Element as SlateElement, Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import classes from './style.module.css';

interface Props {}

export function ToolbarTabsButton({}: Props): React.JSX.Element {
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
