export { type MDXEditorMethods } from '@mdxeditor/editor';

interface Props {
  markdown: string;
}

export function Editor({ markdown }: Props): React.JSX.Element {
  return <div>{markdown}</div>;
}
