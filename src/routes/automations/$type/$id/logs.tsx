import { Card } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  type AutomationLog,
  getAutomationTypesByType,
  getAutomationsByIdLogs,
} from '@/lib/client';
import { createFileRoute } from '@tanstack/react-router';

import '@xyflow/react/dist/style.css';
import { useMemo } from 'react';

export const Route = createFileRoute('/automations/$type/$id/logs')({
  component: RouteComponent,
  loader: async ({ params, abortController }) => {
    const logs = await getAutomationsByIdLogs({
      signal: abortController.signal,
      throwOnError: true,
      path: { id: params.id },
    });

    const type = await getAutomationTypesByType({
      signal: abortController.signal,
      throwOnError: true,
      path: { type: params.type },
    });

    return { logs: logs.data, type: type.data };
  },
});

function LogCard({
  logs,
  from_state,
  to_state,
}: { logs: AutomationLog[]; from_state: string; to_state: string }) {
  const filtered = useMemo(
    () =>
      logs.filter(
        (log) => log.from_state === from_state && log.to_state === to_state,
      ),
    [logs, from_state, to_state],
  );

  return logs.length === 0 ? null : (
    <Card>
      <Collapsible>
        <CollapsibleTrigger>{filtered.length} logs</CollapsibleTrigger>
        <CollapsibleContent>
          {filtered.map((log) => (
            <div key={log.timestamp}>{log.description}</div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function RouteComponent() {
  const { logs, type } = Route.useLoaderData();
  return (
    <>
      <div>{logs[0].automation_id}</div>
      {type.states?.map((state, index) => (
        <>
          {index !== 0 && (
            <LogCard
              logs={logs}
              from_state={type.states?.at(index - 1) ?? state}
              to_state={state}
            />
          )}
          <h4
            key={state}
            className="font-mono border-l-2 stroke-border h-8 px-16 py-10"
          >
            {state}
          </h4>
        </>
      ))}
    </>
  );
}
