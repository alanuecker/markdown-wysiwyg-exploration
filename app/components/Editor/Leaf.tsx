import React from 'react';

import { Code, Em, Strong } from '@radix-ui/themes';
import { RenderLeafProps } from 'slate-react';

interface Props extends RenderLeafProps {}

export function Leaf({ attributes, children, leaf }: Props): React.JSX.Element {
  const { text, ...rest } = leaf;

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
  // note: join in className for PrismJS code highlighting
  return (
    <span {...attributes} style={style} className={Object.keys(rest).join(' ')}>
      {children}
    </span>
  );
}
