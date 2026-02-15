import { Leaderboard } from '@/components/Leaderboard';
import { mcpRegistry } from '@/lib/mcps';
import { MCPData, MCPMetrics } from '@/lib/types';
import {
  getWeeklyDownloads,
  getDownloadsTrend,
  getDownloadsChangePercent,
} from '@/lib/data-sources/npm';
import { getGitHubMetrics, mergeGitHubMetrics } from '@/lib/data-sources/github';

export const revalidate = 3600; // Revalidate page every hour

async function fetchInitialData(): Promise<MCPData[]> {
  const mcpDataArray = await Promise.all(
    mcpRegistry.map(async (mcp) => {
      // Fetch npm data
      const [weeklyDownloads, trend, changePercent] = mcp.npmPackage
        ? await Promise.all([
            getWeeklyDownloads(mcp.npmPackage),
            getDownloadsTrend(mcp.npmPackage),
            getDownloadsChangePercent(mcp.npmPackage),
          ])
        : [null, [], 0];

      // Fetch GitHub data
      const githubMetrics = mcp.githubRepo
        ? await getGitHubMetrics(mcp.githubRepo)
        : null;

      const metrics: MCPMetrics = mergeGitHubMetrics(
        {
          npmDownloadsWeekly: weeklyDownloads ?? 0,
          npmDownloadsChange: changePercent,
        },
        githubMetrics
      );

      return {
        ...mcp,
        metrics,
        trend,
      };
    })
  );

  // Sort by weekly downloads (primary) and stars (secondary)
  mcpDataArray.sort((a, b) => {
    const downloadDiff =
      b.metrics.npmDownloadsWeekly - a.metrics.npmDownloadsWeekly;
    if (downloadDiff !== 0) return downloadDiff;
    return b.metrics.githubStars - a.metrics.githubStars;
  });

  // Add rank
  return mcpDataArray.map((mcp, index) => ({
    ...mcp,
    rank: index + 1,
  }));
}

export default async function Home() {
  const initialData = await fetchInitialData();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          MCP Adoption Metrics
        </h2>
        <p className="text-zinc-400 max-w-2xl">
          Track the growth and adoption of Model Context Protocol servers for
          payments, commerce, and crypto. Ranked by npm weekly downloads with
          GitHub activity metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400 mb-1">Total MCPs Tracked</div>
          <div className="text-3xl font-bold text-white">{initialData.length}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400 mb-1">Total Weekly Downloads</div>
          <div className="text-3xl font-bold text-white">
            {initialData
              .reduce((sum, mcp) => sum + mcp.metrics.npmDownloadsWeekly, 0)
              .toLocaleString()}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-sm text-zinc-400 mb-1">Total GitHub Stars</div>
          <div className="text-3xl font-bold text-white">
            {initialData
              .reduce((sum, mcp) => sum + mcp.metrics.githubStars, 0)
              .toLocaleString()}
          </div>
        </div>
      </div>

      <Leaderboard initialData={initialData} />
    </div>
  );
}
