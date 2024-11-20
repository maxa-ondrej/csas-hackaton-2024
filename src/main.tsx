import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import * as Layout from './components/layout';
import { client } from './lib/client';
import { routeTree } from './routeTree.gen';
import { QueryClient } from '@tanstack/react-query';

// Set up a Router instance
const router = createRouter({
  ...Layout.routerConfig,
  routeTree,
  defaultPreload: 'intent',
  basepath: '/csas-hackaton-2024/',
  context: {
    client: new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
        },
      },
    }),
  },
});

export type Context = {
  client: QueryClient;
};

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
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
