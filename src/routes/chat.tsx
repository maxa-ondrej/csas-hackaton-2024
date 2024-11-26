import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ChatBot } from '@/chat/chatbot';

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ChatBot />;
}
