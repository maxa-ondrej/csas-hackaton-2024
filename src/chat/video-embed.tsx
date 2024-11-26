import { FaYoutube } from 'react-icons/fa';

type Props = {
  url: string;
};

export default function ChatVideoEmbedding({ url }: Props) {
  const embedUrl = `https://www.youtube.com/embed/${url.substring(url.lastIndexOf('/') + 1)}`;
  return (
    <div className="flex flex-row mx-2 my-4">
      <div className="rounded-full h-8 w-8 bg-pink-600 flex items-center justify-center font-semibold text-slate-50 shrink-0">
        <FaYoutube />
      </div>
      <div className="p-1 ml-2">
        <div className="flex-col">
          <p className="font-semibold text-slate-400">Video</p>
          <iframe
            title="Video"
            width="301"
            height="200"
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>
      </div>
    </div>
  );
}
