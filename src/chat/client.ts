import type OpenAI from 'openai';

const BASE_URL = 'http://localhost:3100';

export type Messages = OpenAI.Beta.Threads.MessagesPage['data'];

type Run = {
  status: string;
  thread_id: string;
  run_id: string;
  required_action: {
    submit_tool_outputs: {
      tool_calls: {
        id: string;
        function: {
          name: string;
          arguments: string;
        };
      }[];
    };
  };
};

const post = <T>(path: string, data: object): Promise<T> =>
  fetch(BASE_URL + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

const get = <T>(path: string): Promise<T> =>
  fetch(BASE_URL + path, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then((res) => res.json());

/**
 * This is the client that is used to interact with the chat backend.
 */
export const client = {
  createThread: () =>
    post<{
      thread_id: string;
    }>('/api/threads', {}),
  getThread: (threadId: string) =>
    get<{
      data: {
        content: string;
        role: OpenAI.Beta.Threads.Message['role'] | 'video_embedding';
        hidden: boolean;
        id: string;
        created_at: OpenAI.Beta.Threads.Message['created_at'];
      }[];
    }>(`/api/threads/${threadId}`),
  postMessage: (threadId: string, message: string) =>
    post<Run>(`/api/threads/${threadId}/messages`, { message }),
  fetchRun: (threadId: string, runId: string) =>
    get<Run>(`/api/threads/${threadId}/runs/${runId}`),
  postToolResponse: (
    threadId: string,
    runId: string,
    response: { tool_call_id: string; output: string }[],
  ) =>
    post<Run>(`/api/threads/${threadId}/runs/${runId}/submit_tool_outputs`, {
      response,
    }),
};
