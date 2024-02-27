import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { Form, json, useLoaderData, useSubmit } from '@remix-run/react';
import { getMDXComponent } from 'mdx-bundler/client/index.js';
import { useMemo, useRef } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

import { Editor } from '../components/Editor';
import { getPost, updatePost } from '../models/post.server';

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
  const submit = useSubmit();
  const editorRef = useRef<Node[]>(null);

  const Component = useMemo(
    () => getMDXComponent(data.note.code),
    [data.note.code],
  );

  return (
    <>
      <ClientOnly fallback={<p>Loading...</p>}>
        {() =>
          data.note.id && (
            <div>
              <Form
                onSubmit={(event) => {
                  console.log('save', editorRef?.current);

                  submit(
                    {
                      content: JSON.stringify(editorRef?.current || null),
                    },
                    { method: 'POST' },
                  );
                  event.preventDefault();
                }}
              >
                <button type="submit">Save</button>
              </Form>
              <Editor ref={editorRef} initialValue={data.note.slateData} />
            </div>
          )
        }
      </ClientOnly>
      <Component />
    </>
  );
}
