import { Button } from '@/components/ui/button';
import { getRunnersOptions } from '@/lib/client/@tanstack/react-query.gen';
import { createLoader } from '@/lib/loader';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/runners/')({
  component: RouteComponent,
  loader: ({ context }) =>
    createLoader({
      runners: context.client.fetchQuery(getRunnersOptions()),
    }),
});

function RouteComponent() {
  const { runners } = Route.useLoaderData();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(100);
  const pages = React.useMemo(
    () => Math.ceil(runners.length / pageSize),
    [runners, pageSize],
  );
  return (
    <div>
      <h1>Runners ({runners.length})</h1>
      <ul>
        {runners
          .slice(
            (page - 1) * pageSize,
            Math.min(runners.length - 1, page * pageSize),
          )
          .map((runner) => (
            <li key={runner.id}>
              {runner.organization}:{runner.runner_group}:{runner.id}:
              {runner.state}
            </li>
          ))}
      </ul>
      <span>
        Page {page}/{pages}
      </span>
      <Button onClick={() => setPage(Math.max(1, page - 1))}>Prev</Button>
      <Button onClick={() => setPage(Math.min(pages, page + 1))}>Next</Button>
    </div>
  );
}
