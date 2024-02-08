import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, json, useLoaderData } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';

import { MDXEditor } from '~/components/editor.client';
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

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <ClientOnly fallback={<p>Loading...</p>}>
      {() => data.note.content && <MDXEditor markdown={data.note.content} />}
    </ClientOnly>
  );
}
