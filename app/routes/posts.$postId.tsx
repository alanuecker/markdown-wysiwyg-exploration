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
import { Editor, type MDXEditorMethods } from '../utils/editor.client';

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
              <Editor ref={editorRef} markdown={data.note.content} />
            </div>
          )
        }
      </ClientOnly>
      <Component />
    </>
  );
}
