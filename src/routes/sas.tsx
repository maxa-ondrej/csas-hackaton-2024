import { getSas } from '@/lib/client';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sas')({
  component: RouteComponent,
  loader: async ({ abortController }) => {
    const sases = await getSas({
      signal: abortController.signal,
      throwOnError: true,
    });
    return { sases: sases.data };
  },
});

function RouteComponent() {
  const { sases } = Route.useLoaderData();
  return sases.map((sas) => <div key={sas}>{sas}</div>);
}
