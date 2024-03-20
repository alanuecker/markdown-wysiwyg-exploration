import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import 'modern-normalize/modern-normalize.css';

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Theme>
          <Outlet />
        </Theme>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
