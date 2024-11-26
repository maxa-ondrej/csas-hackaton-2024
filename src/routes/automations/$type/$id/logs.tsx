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
import { useMemo, useState } from 'react';

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

function levelToColor(level: string) {
  switch (level) {
    case 'INFO':
      return 'text-green-500';
    case 'WARNING':
      return 'text-yellow-500';
    case 'ERROR':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

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

  const [open, setOpen] = useState(filtered.length > 0);

  return filtered.length === 0 ? null : (
    <Card className="p-4" onClick={() => setOpen(!open)}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>{filtered.length} logs</CollapsibleTrigger>
        <CollapsibleContent className="font-mono bg-gray-900 rounded p-2 mt-2 text-white">
          {filtered.map((log) => (
            <div key={log.timestamp}>
              <span className={levelToColor(log.level)}>{log.level}</span>{' '}
              {log.description}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function RouteComponent() {
  const { logs, type } = Route.useLoaderData();
  return logs.length === 0 ? (
    <Card>No logs</Card>
  ) : (
    <section className="p-4 md:p-8 w-full overflow-auto">
      <div className="text-2xl mb-6">{logs[0].automation_id}</div>
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
            className="font-mono border-l-2 stroke-border h-8 px-8 py-10 pt-4 ml-4"
          >
            {state}
          </h4>
        </>
      ))}
    </section>
  );
}
