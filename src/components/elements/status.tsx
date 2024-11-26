import type React from 'react';

interface StatusProps {
  value: string;
  color: string;
}

const Status: React.FC<StatusProps> = ({ value, color }) => {
  return (
    <div className="flex items-center rounded overflow-hidden w-fit text-sm mt-2">
      <p className="bg-slate-500 text-white pl-1 pr-1">status</p>
      <p className="pl-1 pr-1 text-white" style={{ backgroundColor: color }}>
        {value}
      </p>
    </div>
  );
};

export { Status };
