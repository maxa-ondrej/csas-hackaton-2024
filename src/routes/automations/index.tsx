import { getAutomationTypes } from '@/lib/client'
import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/automations/')({
  component: RouteComponent,
  loader: async ({ abortController }) => {
    const automations = await getAutomationTypes({
      signal: abortController.signal,
      throwOnError: true,
    })
    return { automations: automations.data }
  },
})

function RouteComponent() {
  const { automations } = Route.useLoaderData()
  return automations.map((automation) => (
    <Link to={`/automations/${automation.type}`} key={automation.type}>
      <div key={automation.type}>{automation.type}</div>
    </Link>
  ))
}
