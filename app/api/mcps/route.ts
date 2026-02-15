import { NextResponse } from 'next/server';
import { mcpRegistry } from '@/lib/mcps';
import { MCPData, MCPMetrics } from '@/lib/types';
import {
  getWeeklyDownloads,
  getDownloadsTrend,
  getDownloadsChangePercent,
} from '@/lib/data-sources/npm';
import { getGitHubMetrics, mergeGitHubMetrics } from '@/lib/data-sources/github';

export const revalidate = 3600; // Revalidate every hour

async function fetchMCPData(mcp: (typeof mcpRegistry)[0]): Promise<MCPData> {
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
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    // Filter MCPs by category if specified
    let mcps = mcpRegistry;
    if (category && category !== 'all') {
      mcps = mcpRegistry.filter((mcp) => mcp.category === category);
    }

    // Fetch data for all MCPs in parallel
    const mcpDataArray = await Promise.all(mcps.map(fetchMCPData));

    // Sort by weekly downloads (primary) and stars (secondary)
    mcpDataArray.sort((a, b) => {
      const downloadDiff =
        b.metrics.npmDownloadsWeekly - a.metrics.npmDownloadsWeekly;
      if (downloadDiff !== 0) return downloadDiff;
      return b.metrics.githubStars - a.metrics.githubStars;
    });

    // Add rank
    const rankedData = mcpDataArray.map((mcp, index) => ({
      ...mcp,
      rank: index + 1,
    }));

    return NextResponse.json(rankedData);
  } catch (error) {
    console.error('Error fetching MCP data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MCP data' },
      { status: 500 }
    );
  }
}
