import { getAutomationTypesOptions } from '@/lib/client/@tanstack/react-query.gen';
import { createLoader } from '@/lib/loader';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/automations/')({
  component: RouteComponent,
  loader: ({ context }) =>
    createLoader({
      automations: context.client.fetchQuery(getAutomationTypesOptions()),
    }),
});

function RouteComponent() {
  const { automations } = Route.useLoaderData();
  return automations.map((automation) => (
    <Link to={`/automations/${automation.type}`} key={automation.type}>
      <div key={automation.type}>{automation.type}</div>
    </Link>
  ));
}
