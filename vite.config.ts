import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

installGlobals();

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    svgr(),
    remix({
      ignoredRouteFiles: ['**/.*'],
    }),
  ],
});
