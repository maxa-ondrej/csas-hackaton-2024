type Props = {
  onNewChat: () => void;
};

export default function Header({ onNewChat }: Props) {
  return (
    <div className="flex flex-row p-4 bg-slate-500 rounded-xl my-4">
      <p className="text-3xl text-slate-200 font-semibold grow">Jarvis</p>
      <button
        type="button"
        className="bg-slate-400 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded"
        onClick={onNewChat}
      >
        New chat
      </button>
    </div>
  );
}
