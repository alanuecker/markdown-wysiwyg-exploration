import { json } from '@remix-run/node';
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
} from '@remix-run/react';
import { Button } from '@radix-ui/themes';

import { Body } from '../components/Body';
import { Navigation } from '../components/Navigation';
import { Main } from '../components/Main';

import { getPostListItems } from '../models/post.server';

export const loader = async () => {
  const postListItems = await getPostListItems();
  return json({ postListItems });
};

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Main>
      <Navigation>
        <h1>
          <Link to=".">Posts</Link>
        </h1>
        <Button
          onClick={() => {
            navigate('new');
          }}
        >
          + New Post
        </Button>
        {data.postListItems.length === 0 ? (
          <p className="p-4">No posts yet</p>
        ) : (
          <ol>
            {data.postListItems.map(post => (
              <li key={post.id}>
                <NavLink to={post.id}>📝 {post.title}</NavLink>
              </li>
            ))}
          </ol>
        )}
      </Navigation>
      <Body>
        <Outlet />
      </Body>
    </Main>
  );
}
