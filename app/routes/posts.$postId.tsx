import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';

import {
  KitchenSinkToolbar,
  MDXEditor,
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
import { getPost } from '~/models/post.server';

export async function loader({ params }: LoaderFunctionArgs) {
  const note = await getPost({ id: params.postId || '' });
  if (!note) {
    throw new Response('Not Found', { status: 404 });
  }

  console.log(note);
  return json({ note });
}

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <ClientOnly fallback={<p>Loading...</p>}>
      {() =>
        data.note.content && (
          <MDXEditor
            markdown={data.note.content}
            plugins={[
              toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }),
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
        )
      }
    </ClientOnly>
  );
}
