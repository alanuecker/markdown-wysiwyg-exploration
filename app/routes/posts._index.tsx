import { Link } from '@remix-run/react';

export default function NoteIndexPage() {
  return (
    <p>
      No post selected. Select a post on the left, or{' '}
      <Link to="new">create a new post.</Link>
    </p>
  );
}
