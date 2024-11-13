import type { createRouter } from '@tanstack/react-router';
import { ErrorPage, NotFoundPage } from './error';
import { LoadingPage } from './loading';

export const routerConfig = {
  defaultErrorComponent: ErrorPage,
  defaultNotFoundComponent: NotFoundPage,
  defaultPendingComponent: LoadingPage,
} satisfies Partial<Parameters<typeof createRouter>[0]>;
