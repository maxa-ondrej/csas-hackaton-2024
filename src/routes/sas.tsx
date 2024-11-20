import { getSasOptions } from '@/lib/client/@tanstack/react-query.gen';
import { createLoader } from '@/lib/loader';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sas')({
  component: RouteComponent,
  loader: ({ context }) =>
    createLoader({
      sases: context.client.fetchQuery(getSasOptions()),
    }),
});

function RouteComponent() {
  const { sases } = Route.useLoaderData();
  return sases.map((sas) => <div key={sas}>{sas}</div>);
}
