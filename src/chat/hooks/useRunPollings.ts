import { useEffect, useRef } from 'react';
import { runFinishedStates } from './constants';
import type { Run } from '../types';
import { client } from '../client';

export const useRunPolling = (
  threadId: string | undefined,
  run: Run | undefined,
  setRun: (run: Run | undefined) => unknown,
) => {
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = async () => {
    if (!run || !threadId) {
      return;
    }
    console.log(`Polling thread ${threadId} run ${run.run_id}`);
    const data = await client.fetchRun(threadId, run.run_id ?? '');
    if (data.run_id !== run?.run_id || data.status !== run.status) {
      setRun(data);
    }
    pollingTimerRef.current = setTimeout(startPolling, 1000);
  };

  const stopPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const needsToPoll = run && !runFinishedStates.includes(run.status);

    if (needsToPoll) {
      startPolling();
    } else {
      stopPolling();
    }

    return stopPolling;
  }, [run]);
};
