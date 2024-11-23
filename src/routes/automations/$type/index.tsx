import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAutomations } from '@/lib/client';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';

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

function RouteComponent() {
  const { automations } = Route.useLoaderData();
  const { type } = Route.useParams();
  const navigate = useNavigate();

  return (
    <>
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
    </>
  );
}
