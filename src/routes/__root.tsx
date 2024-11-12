import { Button } from '@/components/ui/button';
import '../index.css';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import * as React from 'react';
import { version } from '../../package.json';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-2 text-lg text-blue-400">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to="/about"
          activeProps={{
            className: 'font-bold',
          }}
        >
          About
        </Link>{' '}
        <Link
          to="/sas"
          activeProps={{
            className: 'font-bold',
          }}
        >
          SAS
        </Link>
      </div>
      <hr />
      <Button>Hello I am a button!</Button>
      <Outlet />
      <p>
        <small>Current version: v{version}</small>
      </p>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
