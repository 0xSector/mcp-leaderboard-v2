'use client';

interface MetricBadgeProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
}

export function MetricBadge({ label, value, icon, trend }: MetricBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-3 py-2 bg-zinc-800/50 rounded-lg">
      <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-white font-semibold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {trend !== undefined && trend !== 0 && (
          <span
            className={`text-xs ${
              trend > 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend > 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>
    </div>
  );
}
