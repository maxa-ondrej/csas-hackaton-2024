import { Card } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { SheetTrigger } from '@/components/ui/sheet';
import { Sheet, SheetContent } from '@/components/ui/sheet2';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  type Automation,
  type AutomationLog,
  type AutomationType,
  getAutomationTypesByType,
  getAutomationsByIdLogs,
} from '@/lib/client';
import { getAutomationsOptions } from '@/lib/client/@tanstack/react-query.gen';
import { createLoader } from '@/lib/loader';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export const Route = createFileRoute('/automations/$type/')({
  component: RouteComponent,
  loader: ({ params, context }) =>
    createLoader({
      automations: context.client.fetchQuery({
        ...getAutomationsOptions({
          query: { type_eq: params.type },
        }),
        staleTime: 0,
      }),
    }),
});

const columns: ColumnDef<Automation>[] = [
  {
    accessorKey: 'state',
    header: 'State',
  },
];

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

function SheetLogs({ id, type }: { id: string; type: string }) {
  const [logs, setLogs] = useState<AutomationLog[] | null>(null);
  const [automationType, setType] = useState<AutomationType | null>(null);

  useEffect(() => {
    getAutomationsByIdLogs({
      throwOnError: true,
      path: { id },
    }).then((res) => setLogs(res.data));

    getAutomationTypesByType({
      throwOnError: true,
      path: { type },
    }).then((res) => setType(res.data));
  }, [id, type]);

  return logs !== null && automationType ? (
    logs.length > 0 ? (
      <section className="w-full overflow-auto">
        <div className="text-xl mb-6 font-mono">
          Automation {logs[0].automation_id.split('-')[1]} logs
        </div>
        {automationType.states?.map((state, index) => (
          <>
            {index !== 0 && (
              <LogCard
                logs={logs}
                from_state={automationType.states?.at(index - 1) ?? state}
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
    ) : (
      <p className="w-full h-full flex items-center justify-center text-center text-3xl opacity-50">
        <X className="w-16 h-16 pr-4" />
        No logs
      </p>
    )
  ) : (
    <Skeleton className="h-8 w-full" />
  );
}

function RouteComponent() {
  const { automations } = Route.useLoaderData();
  const { type } = Route.useParams();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<{ id: string; type: string } | null>(null);

  return (
    <section className="p-4 md:p-8 w-full overflow-auto">
      <h1 className="text-2xl mb-6 font-mono">{type}</h1>
      <Sheet>
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
              <TableRow key={automation.id} className="cursor-pointer">
                <TableCell>
                  <SheetTrigger
                    onClick={() => setSheet({ id: automation.id, type })}
                  >
                    {automation.id.split('-')[0]}-
                    <b>{automation.id.split('-')[1]}</b>
                  </SheetTrigger>
                </TableCell>
                <TableCell>
                  <Link to={`/automations/${type}/${automation.id}/logs`}>
                    {formatDistanceToNow(Date.parse(automation.last_activity), {
                      addSuffix: true,
                    })}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/sas/jobs?key=${automation.sas}`}>
                    {automation.sas} ↗
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/automations/${type}/${automation.id}/logs`}
                    className="font-mono"
                  >
                    {automation.state === 'APPLYING_PERMISSIONS'
                      ? 'SETUP_TEAM_ACCESS'
                      : automation.state}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <SheetContent>
          {sheet !== null && <SheetLogs id={sheet.id} type={sheet.type} />}
        </SheetContent>
      </Sheet>
    </section>
  );
}
