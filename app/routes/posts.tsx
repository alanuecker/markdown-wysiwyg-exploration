import { json } from '@remix-run/node';
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react';

import { getPostListItems } from '../models/post.server';

export const loader = async () => {
  const postListItems = await getPostListItems();
  return json({ postListItems });
};

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <header>
        <h1>
          <Link to=".">Posts</Link>
        </h1>
      </header>

      <main>
        <div>
          <Link to="new">+ New Post</Link>

          <hr />

          {data.postListItems.length === 0 ? (
            <p className="p-4">No posts yet</p>
          ) : (
            <ol>
              {data.postListItems.map((post) => (
                <li key={post.id}>
                  <NavLink to={post.id}>📝 {post.title}</NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
