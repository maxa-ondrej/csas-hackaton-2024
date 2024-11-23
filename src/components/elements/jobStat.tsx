import type React from 'react';

interface JobStatProps {
  value: number;
  total: number;
  color: string;
  text: string;
}

const JobStat: React.FC<JobStatProps> = ({ value, total, color, text }) => {
  const percentage = Math.round(Math.min((value / total) * 100, 100));

  return (
    <div className="flex gap-2 items-center">
      <div className="h-4 w-4 rounded" style={{ backgroundColor: color }} />
      <p className="text-foreground">
        {value} {text}
      </p>
      <div className="text-sm text-muted-foreground">{percentage}%</div>
    </div>
  );
};

export { JobStat };
