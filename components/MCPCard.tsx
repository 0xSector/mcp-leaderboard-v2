'use client';

import { MCPData } from '@/lib/types';
import { TrendChart } from './TrendChart';
import { MetricBadge } from './MetricBadge';
import { getCategoryColor } from './CategoryFilter';

interface MCPCardProps {
  mcp: MCPData;
  expanded?: boolean;
  onToggle?: () => void;
}

function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function IssueIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function MCPCard({ mcp, expanded, onToggle }: MCPCardProps) {
  const formatLastCommit = (date: string | null) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div
      className={`bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all ${
        expanded ? 'ring-2 ring-zinc-600' : 'hover:border-zinc-700'
      }`}
    >
      <div
        className="p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-full text-lg font-bold text-zinc-300">
            {mcp.rank}
          </div>

          {/* Name and Category */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-white truncate">
                {mcp.name}
              </h3>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getCategoryColor(
                  mcp.category
                )}`}
              >
                {mcp.category}
              </span>
            </div>
            <p className="text-sm text-zinc-500 truncate mt-0.5">
              {mcp.npmPackage || mcp.githubRepo || 'No package info'}
            </p>
          </div>

          {/* Weekly Downloads */}
          <div className="flex-shrink-0 text-right hidden sm:block">
            <div className="text-2xl font-bold text-white">
              {mcp.metrics.npmDownloadsWeekly.toLocaleString()}
            </div>
            <div className="flex items-center justify-end gap-1 text-sm">
              <span className="text-zinc-500">weekly</span>
              {mcp.metrics.npmDownloadsChange !== 0 && (
                <span
                  className={
                    mcp.metrics.npmDownloadsChange > 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {mcp.metrics.npmDownloadsChange > 0 ? '+' : ''}
                  {mcp.metrics.npmDownloadsChange}%
                </span>
              )}
            </div>
          </div>

          {/* Sparkline */}
          <div className="flex-shrink-0 w-24 hidden md:block">
            <TrendChart data={mcp.trend} height={36} />
          </div>

          {/* Stars */}
          <div className="flex-shrink-0 flex items-center gap-1 text-zinc-400 hidden lg:flex">
            <StarIcon />
            <span>{mcp.metrics.githubStars.toLocaleString()}</span>
          </div>

          {/* Expand icon */}
          <div className="flex-shrink-0">
            <svg
              className={`w-5 h-5 text-zinc-500 transition-transform ${
                expanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800">
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricBadge
              label="Weekly Downloads"
              value={mcp.metrics.npmDownloadsWeekly}
              icon={<DownloadIcon />}
              trend={mcp.metrics.npmDownloadsChange}
            />
            <MetricBadge
              label="GitHub Stars"
              value={mcp.metrics.githubStars}
              icon={<StarIcon />}
            />
            <MetricBadge
              label="Forks"
              value={mcp.metrics.githubForks}
              icon={<ForkIcon />}
            />
            <MetricBadge
              label="Open Issues"
              value={mcp.metrics.openIssues}
              icon={<IssueIcon />}
            />
          </div>

          <div className="mt-4">
            <div className="text-sm text-zinc-400 mb-2">30-Day Download Trend</div>
            <div className="h-32 bg-zinc-800/50 rounded-lg p-2">
              <TrendChart data={mcp.trend} height={112} showAxis />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {mcp.description && (
              <p className="text-zinc-400 w-full">{mcp.description}</p>
            )}
            <div className="flex gap-4 text-zinc-500">
              {mcp.npmPackage && (
                <a
                  href={`https://www.npmjs.com/package/${mcp.npmPackage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-300 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  npm
                </a>
              )}
              {mcp.githubRepo && (
                <a
                  href={`https://github.com/${mcp.githubRepo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-300 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  GitHub
                </a>
              )}
              {mcp.website && (
                <a
                  href={mcp.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-300 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Website
                </a>
              )}
            </div>
            <div className="text-zinc-500 ml-auto">
              Last commit: {formatLastCommit(mcp.metrics.lastCommit)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
