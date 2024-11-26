import { useEffect, useState } from 'react';
import { client } from '../client';
import type { Run, Thread } from '../types';
import { runFinishedStates } from './constants';

export const useThread = (
  run: Run | undefined,
  setRun: (run: Run | undefined) => unknown,
) => {
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const [thread, setThread] = useState<Thread | undefined>(undefined);
  const [actionMessages, setActionMessages] = useState<Thread['data']>([]);
  const [messages, setMessages] = useState<Thread['data']>([]);

  // This hook is responsible for creating a new thread if one doesn't exist
  useEffect(() => {
    if (threadId === undefined) {
      const localThreadId = localStorage.getItem('thread_id');
      if (localThreadId) {
        console.log(`Resuming thread ${localThreadId}`);
        setThreadId(localThreadId);
        client.getThread(localThreadId).then(setThread);
      } else {
        console.log('Creating new thread');
        client.createThread().then((data) => {
          setThreadId(data.thread_id);
          localStorage.setItem('thread_id', data.thread_id);
          console.log(`Created new thread ${data.thread_id}`);
        });
      }
    } else {
      setThreadId(threadId);
      client.getThread(threadId).then(setThread);
    }
  }, [threadId]);

  // This hook is responsible for fetching the thread when the run is finished
  useEffect(() => {
    if (!run || !runFinishedStates.includes(run.status)) {
      return;
    }

    console.log(`Retrieving thread ${run.thread_id}`);
    client.getThread(run.thread_id).then((threadData) => {
      setThread(threadData);
    });
  }, [run]);

  // This hook is responsible for transforming the thread into a list of messages
  useEffect(() => {
    if (!thread) {
      return;
    }
    console.log('Transforming thread into messages');

    const newMessages = [...thread.data, ...actionMessages]
      .sort((a, b) => a.created_at - b.created_at)
      .filter((message) => !message.hidden);
    setMessages(newMessages);
  }, [thread, actionMessages]);

  const clearThread = () => {
    localStorage.removeItem('thread_id');
    setThreadId(undefined);
    setThread(undefined);
    setRun(undefined);
    setMessages([]);
    setActionMessages([]);
  };

  return {
    threadId,
    messages,
    actionMessages,
    setActionMessages,
    clearThread,
  };
};
