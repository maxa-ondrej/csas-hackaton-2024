import { SiOpenai } from 'react-icons/si';

type Props = {
  status: string;
};

export default function ChatStatusIndicator({ status }: Props) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-row items-center text-pink-500">
        <div className="m-2 animate-spin">
          <SiOpenai />
        </div>
        <div>{status}</div>
      </div>
    </div>
  );
}
