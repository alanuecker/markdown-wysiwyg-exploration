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

  const style = leaf.color ? { color: leaf.color } : undefined;
  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
}
