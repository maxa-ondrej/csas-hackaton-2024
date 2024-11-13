import { Skeleton } from '@/components/ui/skeleton';
import type { RouteComponent } from '@tanstack/react-router';

const LoadingBlock = () => (
  <div className="space-y-4">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
);

export const LoadingPage: RouteComponent = () => (
  <div className="container mx-auto p-4 sm:p-6 lg:p-8">
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)]
          .map((_, index) => index)
          .map((index) => (
            <LoadingBlock key={index} />
          ))}
      </div>

      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-[100px]" />
        <div className="space-x-2">
          <Skeleton className="h-10 w-10 rounded-full inline-block" />
          <Skeleton className="h-10 w-10 rounded-full inline-block" />
          <Skeleton className="h-10 w-10 rounded-full inline-block" />
        </div>
      </div>
    </div>
  </div>
);
