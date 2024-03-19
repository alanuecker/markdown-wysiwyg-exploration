import React from 'react';
import { RenderElementProps } from 'slate-react';
import { CodeBlock } from '../CodeBlock';
import { CodeTabs } from '../CodeTabs';

interface Props extends RenderElementProps {}

export function Element({
  attributes,
  children,
  element,
}: Props): React.JSX.Element {
  switch (element.type) {
    case 'paragraph':
      return <p {...attributes}>{children}</p>;
    case 'heading': {
      switch (element.depth) {
        case 1:
          return <h1 {...attributes}>{children}</h1>;
        case 2:
          return <h2 {...attributes}>{children}</h2>;
        case 3:
          return <h3 {...attributes}>{children}</h3>;
        case 4:
          return <h4 {...attributes}>{children}</h4>;
        case 5:
          return <h5 {...attributes}>{children}</h5>;
        case 6:
          return <h6 {...attributes}>{children}</h6>;
        default:
          break;
      }
      break;
    }
    case 'thematicBreak':
      return <hr />;
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>;
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
        <table>
          <tbody {...attributes}>{children}</tbody>
        </table>
      );
    case 'tableRow':
      return <tr {...attributes}>{children}</tr>;
    case 'tableCell':
      return <td {...attributes}>{children}</td>;
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
        <a
          {...attributes}
          href={element.url as string}
          title={element.title as string}
        >
          {children}
        </a>
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
        return (
          <CodeTabs {...attributes} element={element}>
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
