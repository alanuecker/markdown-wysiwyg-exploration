import React from 'react';

import { Code, Em, Strong } from '@radix-ui/themes';
import { RenderLeafProps } from 'slate-react';

interface Props extends RenderLeafProps {}

export function Leaf({ attributes, children, leaf }: Props): React.JSX.Element {
  if (leaf.strong) {
    children = <Strong>{children}</Strong>;
  }
  if (leaf.emphasis) {
    children = <Em>{children}</Em>;
  }
  if (leaf.delete) {
    children = <del>{children}</del>;
  }
  if (leaf.inlineCode) {
    children = <Code>{children}</Code>;
  }

  const style = leaf.color ? { color: leaf.color } : undefined;
  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
}
