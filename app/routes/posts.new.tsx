import type { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import { createPost } from '../models/post.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get('title');
  const content = formData.get('content');

  if (typeof title !== 'string' || title.length === 0) {
    return json(
      { errors: { content: null, title: 'Title is required' } },
      { status: 400 },
    );
  }

  if (typeof content !== 'string' || content.length === 0) {
    return json(
      { errors: { content: 'Body is required', title: null } },
      { status: 400 },
    );
  }

  const post = await createPost({ content, title });

  return redirect(`/posts/${post.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.content) {
      contentRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
      }}
    >
      <div>
        <label>
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? 'title-error' : undefined
            }
          />
        </label>
        {actionData?.errors?.title ? (
          <div id="title-error">{actionData.errors.title}</div>
        ) : null}
      </div>

      <div>
        <label>
          <span>Content: </span>
          <textarea
            ref={contentRef}
            name="content"
            rows={8}
            aria-invalid={actionData?.errors?.content ? true : undefined}
            aria-errormessage={
              actionData?.errors?.content ? 'content-error' : undefined
            }
          />
        </label>
        {actionData?.errors?.content ? (
          <div id="content-error">{actionData.errors.content}</div>
        ) : null}
      </div>

      <div>
        <button type="submit">Save</button>
      </div>
    </Form>
  );
}
