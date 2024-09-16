import React from 'react';

import { Heading, Text, Blockquote, Link, Table } from '@radix-ui/themes';
import { RenderElementProps } from 'slate-react';

import { CodeBlock } from '../CodeBlock';
import { CodeTabs } from '../CodeTabs';
import type { CodeTabType } from '../CodeTabs';

interface Props extends RenderElementProps {}

export function Element({
  attributes,
  children,
  element,
}: Props): React.JSX.Element {
  switch (element.type) {
    case 'paragraph':
      return <Text {...attributes}>{children}</Text>;
    case 'heading': {
      switch (element.depth) {
        case 1:
          return (
            <Heading {...attributes} size="9">
              {children}
            </Heading>
          );
        case 2:
          return (
            <Heading {...attributes} as="h2" size="8">
              {children}
            </Heading>
          );
        case 3:
          return (
            <Heading {...attributes} as="h3" size="7">
              {children}
            </Heading>
          );
        case 4:
          return (
            <Heading {...attributes} as="h4" size="6">
              {children}
            </Heading>
          );
        case 5:
          return (
            <Heading {...attributes} as="h5" size="5">
              {children}
            </Heading>
          );
        case 6:
          return (
            <Heading {...attributes} as="h6" size="4">
              {children}
            </Heading>
          );
        default:
          break;
      }
      break;
    }
    case 'thematicBreak':
      return <hr />;
    case 'blockquote':
      return <Blockquote {...attributes}>{children}</Blockquote>;
    case 'list':
      if (element.ordered) {
        return <ol {...attributes}>{children}</ol>;
      }
      return <ul {...attributes}>{children}</ul>;

    case 'listItem':
      return (
        <li {...attributes}>
          {element.checked === true ? (
            <input type="checkbox" readOnly checked />
          ) : element.checked === false ? (
            <input type="checkbox" readOnly />
          ) : null}
          {children}
        </li>
      );
    case 'table':
      return (
        <Table.Root>
          <Table.Body {...attributes}>{children}</Table.Body>
        </Table.Root>
      );
    case 'tableRow':
      return <Table.Row {...attributes}>{children}</Table.Row>;
    case 'tableCell':
      return <Table.Cell {...attributes}>{children}</Table.Cell>;
    case 'code':
      return (
        <CodeBlock {...attributes} element={element}>
          {children}
        </CodeBlock>
      );
    // used for rendering the lines in each code block
    case 'code-line':
      return <div {...attributes}>{children}</div>;
    case 'definition':
      break;
    case 'footnoteDefinition':
      break;
    case 'break':
      return <br />;
    case 'link':
      return (
        <Link
          {...attributes}
          href={element.url as string}
          title={element.title as string}
        >
          {children}
        </Link>
      );
    case 'image':
      return (
        <>
          <img
            {...attributes}
            src={element.url as string}
            title={element.title as string}
            alt={element.alt as string}
          />
          {children}
        </>
      );
    case 'linkReference':
      break;
    case 'imageReference':
      break;
    case 'footnoteReference':
      break;
    case 'containerDirective':
      if (element.name === 'code-tabs') {
        const tabs = element.children?.reduce<CodeTabType[]>(
          (acc, { id, lang }) => {
            return [...acc, { id, lang }];
          },
          [],
        );

        return (
          <CodeTabs {...attributes} element={element} tabs={tabs}>
            {children}
          </CodeTabs>
        );
      }

      return <div style={{ color: 'red' }}>{children}</div>;
    case 'leafDirective':
      return <div style={{ color: 'blue' }}>{children}</div>;
    case 'textDirective':
      return <span style={{ color: 'green' }}>{children}</span>;
    default:
      break;
  }
  return <p {...attributes}>{children}</p>;
}
