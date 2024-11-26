import { Card } from '@/components/ui/card';
import {
  getMetricsOptions,
  getRunnersOptions,
} from '@/lib/client/@tanstack/react-query.gen';
import { createLoader } from '@/lib/loader';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { columns } from '../../lib/columns';
import { DataTable } from '../../lib/data-table';

export const Route = createFileRoute('/runners/')({
  component: RouteComponent,
  loader: ({ context }) =>
    createLoader({
      runners: context.client.fetchQuery(getRunnersOptions()),
      metrics: context.client.fetchQuery(getMetricsOptions()),
    }),
});

function RouteComponent() {
  const { runners, metrics } = Route.useLoaderData();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(100);
  const [metric, setMetric] = React.useState(0);
  const pages = React.useMemo(
    () => Math.ceil(runners.length / pageSize),
    [runners, pageSize],
  );

  setInterval(() => setMetric(metric + 1), 1000);
  console.log(metrics);
  const runnerMetrics = React.useMemo(
    () =>
      runners.map((r) => ({
        ...r,
        metrics: {
          cpu: !['failed', 'offline'].includes(r.state)
            ? `${Math.floor(Math.random() * 80 + 20 / (r.state === 'idle' ? 30 : 1))} %`
            : 'N/A',
          ram: !['failed', 'offline'].includes(r.state)
            ? `${Math.ceil(Math.random() * 80 + 20)} %`
            : 'N/A',
        },
      })),
    [runners],
  );

  return (
    <section className={'p-8 w-full overflow-auto'}>
      <div className="flex flex-row pb-8">
        <Card className="w-60 p-8 flex flex-row mr-6">
          <span className="text-5xl pr-4">
            {
              runnerMetrics.filter((r) => Number.parseInt(r.metrics.cpu) > 90)
                .length
            }
          </span>{' '}
          <p>
            runners are
            <br />
            heavily utilized
          </p>
        </Card>
        <Card className="grid grid-cols-[auto_1fr] gap-0 p-4 px-6">
          <span className="pr-1 text-green-500 text-right">
            {runnerMetrics.filter((r) => r.state === 'active').length}
          </span>{' '}
          <p>are active</p>
          <span className="pr-1 text-blue-500 text-right">
            {runnerMetrics.filter((r) => r.state === 'idle').length}
          </span>{' '}
          <p>are idle</p>
          <span className="pr-1 text-red-500 text-right">
            {runnerMetrics.filter((r) => r.state === 'failed').length}
          </span>{' '}
          <p>have failed</p>
        </Card>
      </div>
      <DataTable data={runnerMetrics} columns={columns} />
    </section>
  );

  /*return (
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
  );*/
}
