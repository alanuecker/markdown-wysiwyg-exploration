import {
  type DirectiveDescriptor,
  MDXEditor,
  type MDXEditorMethods,
  NestedLexicalEditor,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { type ContainerDirective } from 'mdast-util-directive';
import { forwardRef } from 'react';
import { EditorToolbar } from './EditorToolbar.client';

export { type MDXEditorMethods } from '@mdxeditor/editor';

interface Props {
  markdown: string;
}

const CalloutDirectiveDescriptor: DirectiveDescriptor = {
  name: 'callout',
  testNode(node) {
    return node.name === 'callout';
  },
  // set some attribute names to have the editor display a property editor popup.
  attributes: [],
  // used by the generic editor to determine whether or not to render a nested editor.
  hasChildren: true,
  Editor: (props) => {
    return (
      <div style={{ border: '1px solid red', padding: 8, margin: 8 }}>
        <NestedLexicalEditor<ContainerDirective>
          block
          getContent={(node) => node.children}
          // biome-ignore lint:
          getUpdatedMdastNode={(mdastNode, children: any) => {
            return { ...mdastNode, children };
          }}
        />
      </div>
    );
  },
};

export const Editor = forwardRef<MDXEditorMethods, Props>(function Editor(
  { markdown },
  ref,
) {
  return (
    <MDXEditor
      ref={ref}
      markdown={markdown}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => <EditorToolbar />,
        }),
        listsPlugin(),
        quotePlugin(),
        headingsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageUploadHandler: async () => '/sample-image.png',
        }),
        tablePlugin(),
        thematicBreakPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: 'JavaScript',
            css: 'CSS',
            txt: 'text',
            tsx: 'TypeScript',
          },
        }),
        diffSourcePlugin({
          viewMode: 'rich-text',
          diffMarkdown: markdown,
        }),
        markdownShortcutPlugin(),
        directivesPlugin({
          directiveDescriptors: [CalloutDirectiveDescriptor],
        }),
      ]}
    />
  );
});
