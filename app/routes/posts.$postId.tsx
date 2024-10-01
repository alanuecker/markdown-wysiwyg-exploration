import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';

import { OutputView } from '../components/OutputView';
import { EditorView } from '../components/EditorView';
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

  return (
    <>
      <EditorView data={data} />
      <OutputView data={data} />
    </>
  );
}
