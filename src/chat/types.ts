import type { client } from './client';

export type Run = Awaited<ReturnType<typeof client.fetchRun>>;

export type Thread = Awaited<ReturnType<typeof client.getThread>>;
