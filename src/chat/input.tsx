import { MdSend } from 'react-icons/md';
import { useState } from 'react';

export default function ChatInput({
  disabled,
  onSend,
}: { disabled: boolean; onSend: (message: string) => unknown }) {
  const [message, setMessage] = useState('');
  return (
    <form
      className="border-2 border-slate-400 rounded-lg p-2 flex flex-row m-2 text-slate-900"
      onSubmit={(e) => {
        e.preventDefault();
        onSend(message);
        setMessage('');
      }}
      autoComplete="off"
    >
      <input
        name="message"
        placeholder="What can I do for you today?"
        className={'w-full ' + 'bg-slate-100 ' + 'focus:outline-none '}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        disabled={disabled}
        className={
          'bg-slate-900 ' +
          'text-white ' +
          'font-bold ' +
          'py-2 px-4 ' +
          'rounded ' +
          'hover:bg-pink-400 ' +
          'disabled:bg-slate-600 ' +
          'disabled:text-slate-400'
        }
      >
        <MdSend />
      </button>
    </form>
  );
}
