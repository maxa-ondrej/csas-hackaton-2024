import { useState } from 'react';
import './index.css';
import { client } from './client';
import Header from './header';
import { useRunPolling } from './hooks/useRunPollings';
import { useRunRequiredActionsProcessing } from './hooks/useRunRequiredActionsProcessing';
import { useRunStatus } from './hooks/useRunStatus';
import { useThread } from './hooks/useThread';
import ChatInput from './input';
import Loading from './loading';
import ChatMessage from './message';
import ChatStatusIndicator from './status-indicator';
import type { Run } from './types';
import ChatVideoEmbedding from './video-embed';

export function Chat() {
  const [run, setRun] = useState<Run | undefined>(undefined);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const { threadId, messages, setActionMessages, clearThread } = useThread(
    run,
    setRun,
  );
  useRunPolling(threadId, run, setRun);
  useRunRequiredActionsProcessing(run, setRun, setActionMessages);
  const { status, processing } = useRunStatus(run);

  const messageList = messages
    .toReversed()
    .filter((message) => message.hidden !== true)
    .map((message) => {
      if (message.role === 'video_embedding') {
        return <ChatVideoEmbedding url={message.content} key={message.id} />;
      }
      return (
        <ChatMessage
          message={message.content}
          role={message.role}
          key={message.id}
        />
      );
    });

  return (
    <div className="md:container md:mx-auto lg:px-32 h-screen bg-slate-100 flex flex-col">
      <Header onNewChat={clearThread} />
      <div className="flex flex-col-reverse grow overflow-scroll">
        {status !== undefined && <ChatStatusIndicator status={status} />}
        {processing && <Loading />}
        {lastQuestion && (processing || polling) && (
          // biome-ignore lint/a11y/useValidAriaRole: <explanation>
          <ChatMessage message={lastQuestion} role="user" />
        )}
        {messageList}
      </div>
      <div className="my-4">
        <ChatInput
          onSend={(message) => {
            if (threadId === undefined) {
              return;
            }
            setLastQuestion(message);
            setPolling(true);
            client
              .postMessage(threadId, message)
              .then(setRun)
              .then(() => {
                setPolling(false);
              });
          }}
          disabled={processing}
        />
      </div>
    </div>
  );
}
