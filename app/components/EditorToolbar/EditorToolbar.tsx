import React from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import { Form, useSubmit } from '@remix-run/react';

import classes from './style.module.css';
import { ToolbarCodeBlockButton } from '../ToolbarCodeBlockButton';
import { ToolbarTabsButton } from '../ToolbarTabsButton';
import { ToolbarButton } from '../ToolbarButton';

interface Props {
  value: any;
}

export function EditorToolbar({ value }: Props): React.JSX.Element {
  const submit = useSubmit();

  return (
    <Toolbar.Root className={classes.root}>
      <ToolbarCodeBlockButton />
      <ToolbarTabsButton />

      <Form
        onSubmit={event => {
          console.log('save', value);

          submit(
            {
              content: JSON.stringify(value || null),
            },
            { method: 'POST' },
          );
          event.preventDefault();
        }}
      >
        <ToolbarButton type="submit">Save</ToolbarButton>
      </Form>
      <Form
        onSubmit={event => {
          submit(
            {
              content: JSON.stringify(''),
            },
            { method: 'POST' },
          );
          event.preventDefault();
        }}
      >
        <ToolbarButton type="submit">Clear</ToolbarButton>
      </Form>
      {/* <EditorMarkButton format="strong">format_bold</EditorMarkButton>
      <EditorMarkButton format="emphasis">format_italic</EditorMarkButton>
      <EditorMarkButton format="delete">format_delete</EditorMarkButton>
      <EditorBlockButton format="heading" depth={1}>
        format_heading_1
      </EditorBlockButton>
      <EditorBlockButton format="heading" depth={2}>
        format_heading_2
      </EditorBlockButton>
      <EditorBlockButton format="block-quote">format_quote</EditorBlockButton>
      <EditorBlockButton format="numbered-list">
        format_list_numbered
      </EditorBlockButton>
      <EditorBlockButton format="bulleted-list">
        format_list_bulleted
      </EditorBlockButton>
      <EditorBlockButton format="left">format_align_left</EditorBlockButton>
      <EditorBlockButton format="center">format_align_center</EditorBlockButton>
      <EditorBlockButton format="right">format_align_right</EditorBlockButton>
      <EditorBlockButton format="justify">
        format_align_justify
      </EditorBlockButton> */}
    </Toolbar.Root>
  );
}
