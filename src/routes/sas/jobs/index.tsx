import jobs from '@/lib/mock/jobs.json';

import { JobStat } from '@/components/elements/jobStat';
import { Status } from '@/components/elements/status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DatePickerWithRange } from '@/components/ui/datepicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { H1, H5 } from '@/components/ui/typography';
import type { State } from '@/lib/client';
import { getSasOptions } from '@/lib/client/@tanstack/react-query.gen';
import { createLoader } from '@/lib/loader';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

type SearchParams = {
  key?: string;
  dateFrom?: string;
  dateTo?: string;
  state?: State;
  deployType?: string;
};

type DeployType = {
  id: string;
  name: string;
  organization: string;
  runnerGroup: string;
};

const deployTypes: DeployType[] = [
  {
    id: 'build',
    name: 'Build aplikací',
    organization: 'csas-dev',
    runnerGroup: 'csas-linux',
  },
  {
    id: 'test',
    name: 'Testování aplikací',
    organization: 'csas-dev',
    runnerGroup: 'csas-linux-test',
  },
  {
    id: 'deploy-nonprod',
    name: 'Deploy do neprodukčního prostředí',
    organization: 'csas-ops',
    runnerGroup: 'csas-linux',
  },
  {
    id: 'deploy-prod',
    name: 'Deploy do produkčního prostředí',
    organization: 'csas-ops',
    runnerGroup: 'csas-linux-prod',
  },
];

export const Route = createFileRoute('/sas/jobs/')({
  component: RouteComponent,
  loader: ({ context }) =>
    createLoader({
      sases: context.client.fetchQuery(getSasOptions()),
      jobs: jobs,
    }),
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      key: search.key as string | undefined,
      dateFrom: search.dateFrom as string | undefined,
      dateTo: search.dateTo as string | undefined,
      state: search.state as State | undefined,
      deployType: search.deployType as string | undefined,
    };
  },
});

const states = ['success', 'failed', 'queued', 'in_progress'];

const getColor = (state: string) => {
  switch (state) {
    case 'success':
      return '#34d399';
    case 'in_progress':
      return '#fbbf24';
    case 'failed':
      return '#ef4444';
    case 'queued':
      return '#6b7280';
    default:
      return '#000000';
  }
};

function RouteComponent() {
  const { sases, jobs } = Route.useLoaderData();
  const { key, dateFrom, dateTo, state, deployType } = useSearch({
    from: Route.id,
  });
  const selectedCardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [currentKey, setCurrentKey] = useState<string | undefined>(key);
  const [currentDateFrom, setCurrentDateFrom] = useState<string | undefined>(
    dateFrom,
  );
  const [currentDateTo, setCurrentDateTo] = useState<string | undefined>(
    dateTo,
  );
  const [currentState, setCurrentState] = useState<string | undefined>(state);
  const [currentDeployType, setCurrentDeployType] = useState<
    string | undefined
  >(deployType);

  useEffect(() => {
    const handleSasKeyChange = (event: CustomEvent) => {
      setCurrentKey(event.detail.key);
      navigate({
        to: '/sas/jobs',
        search: {
          key: event.detail.key,
          dateFrom: currentDateFrom,
          dateTo: currentDateTo,
          state: currentState,
          deployType: currentDeployType,
        },
        replace: true,
      });
    };

    const handleDateFromChange = (event: CustomEvent) => {
      setCurrentDateFrom(event.detail.dateFrom);
      navigate({
        to: '/sas/jobs',
        search: {
          key: currentKey,
          dateFrom: event.detail.dateFrom,
          dateTo: currentDateTo,
          state: currentState,
          deployType: currentDeployType,
        },
        replace: true,
      });
    };

    const handleDateToChange = (event: CustomEvent) => {
      setCurrentDateTo(event.detail.dateTo);
      navigate({
        to: '/sas/jobs',
        search: {
          key: currentKey,
          dateFrom: currentDateFrom,
          dateTo: event.detail.dateTo,
          state: currentState,
          deployType: currentDeployType,
        },
        replace: true,
      });
    };

    const handleStateChange = (event: CustomEvent) => {
      setCurrentState(event.detail.state);
      navigate({
        to: '/sas/jobs',
        search: {
          key: currentKey,
          dateFrom: currentDateFrom,
          dateTo: currentDateTo,
          state: event.detail.state,
          deployType: currentDeployType,
        },
        replace: true,
      });
    };

    const handleDeployTypeChange = (event: CustomEvent) => {
      setCurrentDeployType(event.detail.deployType);
      navigate({
        to: '/sas/jobs',
        search: {
          key: currentKey,
          dateFrom: currentDateFrom,
          dateTo: currentDateTo,
          state: currentState,
          deployType: event.detail.deployType,
        },
        replace: true,
      });
    };

    window.addEventListener(
      'sasKeyChange',
      handleSasKeyChange as EventListener,
    );
    window.addEventListener(
      'dateFromChange',
      handleDateFromChange as EventListener,
    );
    window.addEventListener(
      'dateToChange',
      handleDateToChange as EventListener,
    );
    window.addEventListener('stateChange', handleStateChange as EventListener);
    window.addEventListener(
      'deployTypeChange',
      handleDeployTypeChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        'sasKeyChange',
        handleSasKeyChange as EventListener,
      );
      window.removeEventListener(
        'dateFromChange',
        handleDateFromChange as EventListener,
      );
      window.removeEventListener(
        'dateToChange',
        handleDateToChange as EventListener,
      );
      window.removeEventListener(
        'stateChange',
        handleStateChange as EventListener,
      );
      window.removeEventListener(
        'deployTypeChange',
        handleDeployTypeChange as EventListener,
      );
    };
  }, [
    navigate,
    currentKey,
    currentDateFrom,
    currentDateTo,
    currentState,
    currentDeployType,
  ]);

  useEffect(() => {
    setCurrentKey(key);
  }, [key]);

  useEffect(() => {
    if (currentKey && selectedCardRef.current) {
      selectedCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentKey]);

  const sasesPreprocessed = sases.map((sas) => {
    const selectedDeployType = deployTypes.find(
      (dt) => dt.id === currentDeployType,
    );

    const jobsFiltered = jobs.filter(
      (job) =>
        job.SAS === sas &&
        new Date(job.timestamp).getTime() >=
          new Date(currentDateFrom ?? '1970-01-01').getTime() &&
        (!currentState ||
          currentState === 'all' ||
          job.state === currentState) &&
        (!currentDeployType ||
          currentDeployType === 'all' ||
          (job.organization === selectedDeployType?.organization &&
            job.runner_group === selectedDeployType?.runnerGroup)),
    );

    return {
      sas,
      lastJob: jobs.filter((job) => job.SAS === sas)[0],
      jobs: jobsFiltered,
      success: jobsFiltered.filter((job) => job.state === 'success'),
      inProgress: jobsFiltered.filter((job) => job.state === 'in_progress'),
      failed: jobsFiltered.filter((job) => job.state === 'failed'),
      queued: jobsFiltered.filter((job) => job.state === 'queued'),
    };
  });

  const chartData = sasesPreprocessed.map((sas) => ({
    name: sas.sas,
    jobs: sas.jobs.length,
    success: sas.success.length,
    failed: sas.failed.length,
    queued: sas.queued.length,
    in_progress: sas.inProgress.length,
  }));

  return (
    <section className="p-4 md:p-8 w-full overflow-auto">
      <H1>Job statistics for SASes</H1>

      <div className="flex items-center space-x-4 mt-16">
        <Select
          value={currentDeployType}
          onValueChange={(value) => {
            window.dispatchEvent(
              new CustomEvent('deployTypeChange', {
                detail: { deployType: value },
              }),
            );
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by deploy type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {deployTypes.map((dt) => (
              <SelectItem key={dt.id} value={dt.id}>
                {dt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentState}
          onValueChange={(value) => {
            window.dispatchEvent(
              new CustomEvent('stateChange', { detail: { state: value } }),
            );
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All states</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
          </SelectContent>
        </Select>

        <DatePickerWithRange
          onValueChange={(date) => {
            console.log(date);
            if (date?.from) {
              window.dispatchEvent(
                new CustomEvent('dateFromChange', {
                  detail: { dateFrom: date.from.toISOString().split('T')[0] },
                }),
              );
            }
            if (date?.to) {
              window.dispatchEvent(
                new CustomEvent('dateToChange', {
                  detail: { dateFrom: date.to.toISOString().split('T')[0] },
                }),
              );
            }
          }}
        />

        <Select
          value={currentDateFrom}
          onValueChange={(value) => {
            window.dispatchEvent(
              new CustomEvent('dateFromChange', {
                detail: { dateFrom: value },
              }),
            );
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1970-01-01">All time</SelectItem>
            <SelectItem
              value={
                new Date(new Date().setMonth(new Date().getMonth() - 1))
                  .toISOString()
                  .split('T')[0]
              }
            >
              This month
            </SelectItem>
            <SelectItem
              value={
                new Date(new Date().setMonth(new Date().getMonth() - 2))
                  .toISOString()
                  .split('T')[0]
              }
            >
              Last month
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent('sasKeyChange', { detail: {} }),
            );
            window.dispatchEvent(
              new CustomEvent('dateFromChange', { detail: {} }),
            );
            window.dispatchEvent(
              new CustomEvent('stateChange', { detail: {} }),
            );
            window.dispatchEvent(
              new CustomEvent('deployTypeChange', { detail: {} }),
            );
          }}
        >
          Reset filters
        </Button>
      </div>

      <div className="w-full mt-4 grid gap-4 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
        <Card className="p-8 h-[max(512px,50vh)] xl:h-full w-full max-w-full 2xl:col-span-2">
          <H5>Jobs by SAS</H5>
          <div className="mt-8 overflow-x-auto overflow-y-hidden h-full pb-16 w-full max-w-full">
            <ChartContainer
              config={{
                success: {
                  color: '#34d399',
                },
              }}
              className="h-full w-full"
            >
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 42 }}
              >
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  dataKey="jobs"
                />
                <YAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  display="none"
                  type="category"
                />
                <CartesianGrid />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                {states.map((state) => (
                  <Bar
                    key={state}
                    dataKey={state}
                    fill={getColor(state)}
                    stackId="a"
                    radius={state === 'success' ? [4, 0, 0, 4] : [0, 4, 4, 0]}
                  >
                    {chartData.map((entry) => {
                      const keys = Object.keys(entry);
                      const values = Object.values(entry);

                      const stateNameIndex = keys.findIndex(
                        (key) => key === state,
                      );
                      const lastBarIndex = values.findLastIndex(
                        (value) => value !== 0,
                      );
                      const firstBarIndex = values.findIndex(
                        (value, index) => value !== 0 && index !== 0,
                      );

                      if (
                        stateNameIndex === lastBarIndex ||
                        stateNameIndex === firstBarIndex
                      ) {
                        return <Cell key={`cell-${state}-${entry.name}`} />;
                      }

                      return (
                        <Cell key={`cell-${state}-${entry.name}`} radius={0} />
                      );
                    })}
                    {state === 'success' && (
                      <LabelList dataKey="name" position="left" fill="#000" />
                    )}
                  </Bar>
                ))}
              </BarChart>
            </ChartContainer>
          </div>
        </Card>
        <Card className="p-8 w-full max-w-full">
          <H5>Latest jobs</H5>
          <div className="flex flex-col">
            {jobs.slice(0, 6).map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('sasKeyChange', {
                      detail: { key: job.SAS },
                    }),
                  );
                }}
                onKeyDown={() => {
                  window.dispatchEvent(
                    new CustomEvent('sasKeyChange', {
                      detail: { key: job.SAS },
                    }),
                  );
                }}
              >
                <Separator className="mt-2 mb-2" />
                <CardHeader className="p-2 flex flex-row items-center justify-between">
                  <CardTitle>{job.SAS}</CardTitle>
                  <Status value={job.state} color={getColor(job.state)} />
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="text-sm text-muted-foreground">
                    {new Date(job.timestamp).toLocaleDateString('cs-CZ', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    })}
                    {', '}
                    {new Date(job.timestamp).toLocaleTimeString('cs-CZ', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </div>
                </CardContent>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="pt-16 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {sasesPreprocessed.map((sas) => (
          <Card
            key={sas.sas}
            ref={sas.sas === currentKey ? selectedCardRef : undefined}
            className={`transition-all duration-200 ${
              sas.sas === currentKey ? 'ring-2 ring-primary shadow-lg' : ''
            }`}
          >
            <CardHeader className="pb-0">
              <CardTitle className="flex flex-row justify-between items-center">
                {sas.sas}
                <div className="m-l-auto text-muted-foreground text-sm">
                  {sas.jobs.length} jobs
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Status
                value={sas.lastJob.state ?? ''}
                color={getColor(sas.lastJob.state ?? '')}
              />
              <Separator className="mt-2 mb-2" />
              <JobStat
                value={sas.success.length}
                total={sas.jobs.length}
                color={getColor('success')}
                text="successful jobs"
              />
              <JobStat
                value={sas.failed.length}
                total={sas.jobs.length}
                color={getColor('failed')}
                text="failed jobs"
              />
              <JobStat
                value={sas.queued.length}
                total={sas.jobs.length}
                color={getColor('queued')}
                text="queued jobs"
              />
              <JobStat
                value={sas.inProgress.length}
                total={sas.jobs.length}
                color={getColor('in_progress')}
                text="jobs in progress"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
