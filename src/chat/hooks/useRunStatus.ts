import { useEffect, useState } from 'react';
import type { Run } from '../types';
import { runFinishedStates } from './constants';

export const useRunStatus = (run: Run | undefined) => {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (run?.status === 'in_progress') {
      setStatus('Thinking ...');
    } else if (run?.status === 'queued') {
      setStatus('Queued ...');
    } else {
      setStatus(undefined);
    }
  }, [run]);

  useEffect(() => {
    setProcessing(!runFinishedStates.includes(run?.status ?? 'completed'));
  }, [run]);

  return { status, processing };
};
