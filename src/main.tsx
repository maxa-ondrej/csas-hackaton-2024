import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { routeTree } from './routeTree.gen';
import { client } from './lib/client';

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  basepath: '/csas-hackaton-2024/',
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

client.setConfig({
  baseUrl: 'https://hackaton-api.fly.dev/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Basic ZG9wbzpEZXZPcHMyMDI0',
  },
});

// biome-ignore lint/style/noNonNullAssertion: element must exist
const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
