import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { Form, json, useLoaderData, useSubmit } from '@remix-run/react';
import { getMDXComponent } from 'mdx-bundler/client/index.js';
import { useEffect, useMemo, useRef } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

import { getPost, updatePost } from '../models/post.server';
import {
  ButtonWithTooltip,
  DirectiveDescriptor,
  MDXEditor,
  MDXEditorMethods,
  NestedLexicalEditor,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  headingsPlugin,
  imagePlugin,
  insertDirective$,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  usePublisher,
} from '../utils/editor.client';

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const content = formData.get('content');

  if (typeof content !== 'string' || content.length === 0) {
    return json(
      { errors: { content: 'Body is required', title: null } },
      { status: 400 },
    );
  }

  await updatePost({ id: params.postId || '', content });
  return null;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const note = await getPost({ id: params.postId || '' });
  if (!note) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ note });
}

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

const DirectiveButton = () => {
  // grab the insertDirective action (a.k.a. publisher) from the
  // state management system of the directivesPlugin
  const insertDirective = usePublisher(insertDirective$);

  return (
    <ButtonWithTooltip
      title="Inset tabs"
      onClick={() => {
        insertDirective({
          name: 'callout',
          type: 'leafDirective',
          attributes: {},
          children: [],
        } as LeafDirective);
      }}
    >
      Tabs
    </ButtonWithTooltip>
  );
};

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
          getUpdatedMdastNode={(mdastNode, children: any) => {
            return { ...mdastNode, children };
          }}
        />
      </div>
    );
  },
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const editorRef = useRef<MDXEditorMethods>(null);
  const submit = useSubmit();

  // update editor content from external source
  // note: this could be restricted to data.note.id if we want to avoid
  // overrinding the same content with a save action
  useEffect(() => {
    if (editorRef.current && data.note.content) {
      editorRef.current.setMarkdown(data.note.content);
    }
  }, [data.note.content]);

  const Component = useMemo(
    () => getMDXComponent(data.note.code),
    [data.note.code],
  );

  return (
    <>
      <ClientOnly fallback={<p>Loading...</p>}>
        {() =>
          data.note.content && (
            <div>
              <Form
                onSubmit={(event) => {
                  submit(
                    { content: editorRef.current?.getMarkdown() || '' },
                    { method: 'POST' },
                  );
                  event.preventDefault();
                }}
              >
                <button type="submit">Save</button>
              </Form>
              <MDXEditor
                ref={editorRef}
                markdown={data.note.content}
                plugins={[
                  toolbarPlugin({
                    toolbarContents: () => <DirectiveButton />,
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
                    diffMarkdown: data.note.content,
                  }),
                  markdownShortcutPlugin(),
                  directivesPlugin({
                    directiveDescriptors: [CalloutDirectiveDescriptor],
                  }),
                ]}
              />
            </div>
          )
        }
      </ClientOnly>
      <Component />
    </>
  );
}
