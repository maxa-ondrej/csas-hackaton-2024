import { getSas } from '@/lib/client';
import { createFileRoute, notFound } from '@tanstack/react-router';
import * as React from 'react';

export const Route = createFileRoute('/sas')({
  component: RouteComponent,
  loader: async ({ abortController }) => {
    const sases = await getSas({
      signal: abortController.signal,
      throwOnError: true,
    });
    return { sases: sases.data };
  },
  staleTime: Number.POSITIVE_INFINITY,
});

function RouteComponent() {
  const { sases } = Route.useLoaderData();
  return sases.map((sas) => <div key={sas}>{sas}</div>);
}
