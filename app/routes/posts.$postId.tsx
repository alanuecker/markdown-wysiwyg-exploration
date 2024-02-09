import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, json, useLoaderData, useSubmit } from '@remix-run/react';
import { useRef } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

import {
  KitchenSinkToolbar,
  MDXEditor,
  MDXEditorMethods,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
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
} from '~/components/editor.client';
import { getPost, updatePost } from '~/models/post.server';

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

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const editorRef = useRef<MDXEditorMethods>(null);
  const submit = useSubmit();

  return (
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
                  toolbarContents: () => <KitchenSinkToolbar />,
                }),
                listsPlugin(),
                quotePlugin(),
                headingsPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                // eslint-disable-next-line @typescript-eslint/require-await
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
              ]}
            />
          </div>
        )
      }
    </ClientOnly>
  );
}
