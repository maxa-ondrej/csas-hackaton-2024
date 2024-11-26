import { useEffect } from 'react';
import { client } from '../client';
import type { Run, Thread } from '../types';

type ActionMessage = Thread['data'][number];

export const useRunRequiredActionsProcessing = (
  run: Run | undefined,
  setRun: (run: Run | undefined) => unknown,
  setActionMessages: (actionMessages: ActionMessage[]) => unknown,
) => {
  useEffect(() => {
    if (!run || run.status !== 'requires_action') {
      return;
    }
    const response = new Array<{ tool_call_id: string; output: string }>();
    const actionMessages = new Array<ActionMessage>();
    for (const tool_call of run.required_action.submit_tool_outputs
      .tool_calls) {
      if (tool_call.function.name === 'embed_youtube_video') {
        response.push({
          tool_call_id: tool_call.id,
          output: "{'success': true}",
        });

        const url: string = JSON.parse(tool_call.function.arguments).url;
        actionMessages.push({
          id: `video_embedding_${url}_${Date.now()}`,
          content: url,
          role: 'video_embedding',
          created_at: Math.floor(Date.now() / 1000),
          hidden: false,
        });
      }
    }
    setActionMessages(actionMessages);
    client.postToolResponse(run.thread_id, run.run_id, response).then(setRun);
  }, [run, setRun, setActionMessages]);
};
