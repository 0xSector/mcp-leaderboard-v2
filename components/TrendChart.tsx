'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface TrendChartProps {
  data: number[];
  height?: number;
  showAxis?: boolean;
  color?: string;
}

export function TrendChart({
  data,
  height = 40,
  showAxis = false,
  color = '#22c55e',
}: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-zinc-500 text-xs"
        style={{ height }}
      >
        No data
      </div>
    );
  }

  const chartData = data.map((value, index) => ({
    day: index + 1,
    downloads: value,
  }));

  // Determine trend direction
  const isPositive = data[data.length - 1] >= data[0];
  const trendColor = isPositive ? color : '#ef4444';

  if (!showAxis) {
    // Sparkline version
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${trendColor}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={trendColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={trendColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="downloads"
            stroke={trendColor}
            strokeWidth={2}
            fill={`url(#gradient-${trendColor})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // Full chart with axis
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 10 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 10 }}
          tickFormatter={(value) =>
            value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
          }
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#a1a1aa' }}
          itemStyle={{ color: trendColor }}
          formatter={(value) => [typeof value === 'number' ? value.toLocaleString() : value, 'Downloads']}
          labelFormatter={(label) => `Day ${label}`}
        />
        <Line
          type="monotone"
          dataKey="downloads"
          stroke={trendColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: trendColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
