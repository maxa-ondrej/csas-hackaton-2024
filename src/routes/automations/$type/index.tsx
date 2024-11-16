import { type Automation, getAutomations } from '@/lib/client';
import { createFileRoute } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/automations/$type/')({
  component: RouteComponent,
  loader: async ({ params, abortController }) => {
    const automations = await getAutomations({
      signal: abortController.signal,
      throwOnError: true,
      query: { type_eq: params.type },
    });

    return { automations: automations.data };
  },
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
