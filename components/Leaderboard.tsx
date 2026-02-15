'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { MCPData } from '@/lib/types';
import { MCPCard } from './MCPCard';
import { CategoryFilter } from './CategoryFilter';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface LeaderboardProps {
  initialData?: MCPData[];
}

export function Leaderboard({ initialData }: LeaderboardProps) {
  const [category, setCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR<MCPData[]>(
    `/api/mcps?category=${category}`,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 60 * 60 * 1000, // Refresh every hour
    }
  );

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg">Failed to load MCP data</div>
        <p className="text-zinc-500 mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CategoryFilter selected={category} onChange={setCategory} />
        <div className="text-sm text-zinc-500">
          {data?.length || 0} MCPs tracked
        </div>
      </div>

      {isLoading && !data ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-zinc-900 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data?.map((mcp) => (
            <MCPCard
              key={mcp.id}
              mcp={mcp}
              expanded={expandedId === mcp.id}
              onToggle={() => handleToggle(mcp.id)}
            />
          ))}
        </div>
      )}

      {data?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-zinc-400">No MCPs found in this category</div>
        </div>
      )}
    </div>
  );
}
