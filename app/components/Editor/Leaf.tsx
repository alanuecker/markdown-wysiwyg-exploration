import React from 'react';
import { RenderLeafProps } from 'slate-react';

interface Props extends RenderLeafProps {}

export function Leaf({ attributes, children, leaf }: Props): React.JSX.Element {
  if (leaf.strong) {
    children = <strong>{children}</strong>;
  }
  if (leaf.emphasis) {
    children = <em>{children}</em>;
  }
  if (leaf.delete) {
    children = <del>{children}</del>;
  }
  if (leaf.inlineCode) {
    children = <code>{children}</code>;
  }
  return <span {...attributes}>{children}</span>;
}
