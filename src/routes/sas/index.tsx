import { Button } from '@/components/ui/button';
import { Link, createFileRoute } from '@tanstack/react-router';
import * as React from 'react';

export const Route = createFileRoute('/sas/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="p-8 w-full overflow-auto">
      <h1>SAS</h1>
      <Link to="/sas/jobs" activeProps={{ className: 'font-bold' }}>
        <Button>Jobs</Button>
      </Link>
    </section>
  );
}
