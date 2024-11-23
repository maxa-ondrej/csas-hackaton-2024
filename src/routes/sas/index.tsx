import { JobStat } from '@/components/elements/jobStat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import { H1 } from '@/components/ui/typography';
import {
  getJobsOptions,
  getSasOptions,
} from '@/lib/client/@tanstack/react-query.gen';
import { createLoader } from '@/lib/loader';
import { createFileRoute } from '@tanstack/react-router';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

export const Route = createFileRoute('/sas/')({
  component: RouteComponent,
  loader: ({ context }) =>
    createLoader({
      sases: context.client.fetchQuery(getSasOptions()),
      jobs: context.client.fetchQuery(getJobsOptions()),
    }),
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
  const sasesPreprocessed = sases.map((sas) => ({
    sas,
    jobs: jobs.filter((job) => job.SAS === sas),
    success: jobs.filter((job) => job.SAS === sas && job.state === 'success'),
    inProgress: jobs.filter(
      (job) => job.SAS === sas && job.state === 'in_progress',
    ),
    failed: jobs.filter((job) => job.SAS === sas && job.state === 'failed'),
    queued: jobs.filter((job) => job.SAS === sas && job.state === 'queued'),
  }));
  const chartData = sasesPreprocessed.map((sas) => ({
    name: sas.sas,
    success: sas.success.length,
    failed: sas.failed.length,
    queued: sas.queued.length,
    in_progress: sas.inProgress.length,
  }));
  return (
    <section className="p-8 w-full overflow-auto">
      <H1>SAS</H1>
      <div className="pt-16 overflow-x-auto overflow-y-hidden w-full max-w-full">
        <ChartContainer
          config={{
            success: {
              color: '#34d399',
            },
          }}
          className="h-96 w-full"
        >
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              display="none"
            />
            <YAxis tickLine={false} tickMargin={10} axisLine={false} />
            <CartesianGrid vertical={false} />
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
                radius={state === 'success' ? [0, 0, 4, 4] : [4, 4, 0, 0]}
              >
                {chartData.map((entry) => {
                  const keys = Object.keys(entry);
                  const values = Object.values(entry);

                  const stateNameIndex = keys.findIndex((key) => key === state);
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
                    return <Cell key={`cell-${state}`} />;
                  }

                  return <Cell key={`cell-${state}`} radius={0} />;
                })}
                {state === 'success' && (
                  <LabelList
                    dataKey={state}
                    position="top"
                    content={({ value }) => value}
                    fill="#fff"
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
      </div>
      <div className="pt-16 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {sasesPreprocessed.map((sas) => (
          <Card key={sas.sas}>
            <CardHeader className="pb-0">
              <CardTitle className="flex flex-row justify-between items-center">
                {sas.sas}
                <div className="m-l-auto text-muted-foreground text-sm">
                  {sas.jobs.length} jobs
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
