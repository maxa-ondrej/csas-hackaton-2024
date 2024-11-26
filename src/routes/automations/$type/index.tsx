import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Automation } from '@/lib/client';
import { getAutomationsOptions } from '@/lib/client/@tanstack/react-query.gen';
import { createLoader } from '@/lib/loader';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';

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
  const { automations } = Route.useLoaderData();
  const { type } = Route.useParams();
  const navigate = useNavigate();

  return (
    <section className="p-4 md:p-8 w-full overflow-auto">
      <h1 className="text-2xl mb-6">{type}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Last activity</TableHead>
            <TableHead>SAS</TableHead>
            <TableHead>State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {automations.map((automation) => (
            <TableRow
              key={automation.id}
              onClick={() =>
                navigate({ to: `/automations/${type}/${automation.id}/logs` })
              }
              className="cursor-pointer"
            >
              <TableCell>{automation.id}</TableCell>
              <TableCell>
                {formatDistanceToNow(Date.parse(automation.last_activity), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>{automation.sas}</TableCell>
              <TableCell>{automation.state}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
