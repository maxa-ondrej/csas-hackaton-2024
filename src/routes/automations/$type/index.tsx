import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Automation, getAutomations } from '@/lib/client';
import { Link, createFileRoute } from '@tanstack/react-router';
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
  const { automations } = Route.useLoaderData();
  const { type } = Route.useParams();

  return (
    <>
      <h1 className="font-bold">{type}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Last activity</TableHead>
            <TableHead>State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {automations.map((automation) => (
            <Link
              to={`/automations/${type}/${automation.id}/logs`}
              key={automation.id}
            >
              <TableRow key={automation.id}>
                <TableCell>{automation.id}</TableCell>
                <TableCell>{automation.last_activity}</TableCell>
                <TableCell>{automation.state}</TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
