import { type Automation, getAutomations } from '@/lib/client';
import { getAutomationsOptions } from '@/lib/client/@tanstack/react-query.gen';
import { createLoader } from '@/lib/loader';
import { createFileRoute } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/automations/$type/')({
  component: RouteComponent,
  loader: ({ params, context }) =>
    createLoader({
      automations: context.client.fetchQuery(
        getAutomationsOptions({
          query: { type_eq: params.type },
        }),
      ),
    }),
});

const columns: ColumnDef<Automation>[] = [
  {
    accessorKey: 'state',
    header: 'State',
  },
];

function RouteComponent() {
  return;
}
