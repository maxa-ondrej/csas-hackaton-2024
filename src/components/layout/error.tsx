import type {
  ErrorRouteComponent,
  NotFoundRouteComponent,
} from '@tanstack/react-router';
import { TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

type ErrorComponentProps = {
  message: string;
};

const ErrorComponent = ({ message }: ErrorComponentProps) => (
  <p className="text-red-500">{message}</p>
);

const messagesHistory = new Map<string, number>();

export const ErrorPage: ErrorRouteComponent = ({ error }) => {
  const lastMessage = messagesHistory.get(error.message);
  if (!lastMessage || lastMessage + 5 * 60 * 1000 > Date.now()) {
    messagesHistory.set(error.message, 1);
    toast('An error occurred', {
      description: error.message,
      dismissible: true,
      position: 'top-right',
      richColors: true,
      closeButton: true,
      icon: <TriangleAlert />,
    });
  }
  return <ErrorComponent message={error.message} />;
};

export const NotFoundPage: NotFoundRouteComponent = () => (
  <ErrorComponent message={'Not Found'} />
);
