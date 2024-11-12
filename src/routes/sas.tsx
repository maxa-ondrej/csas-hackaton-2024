import { getSas } from '@/lib/client';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';

export const Route = createFileRoute('/sas')({
  component: RouteComponent,
  loader: () =>
    getSas().then(({ data, error }) => {
      if (error) {
        throw error;
      }
      return data;
    }),
  staleTime: Number.POSITIVE_INFINITY,
  errorComponent: ({ error }) => <div>{error.message}</div>,
});

function RouteComponent() {
  const sases = Route.useLoaderData();
  return sases.map((sas) => <div key={sas}>{sas}</div>);
}
