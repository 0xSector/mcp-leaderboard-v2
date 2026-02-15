import { GitHubRepoResponse, MCPMetrics } from '../types';
import { getCached, setCache } from './cache';

const GITHUB_API_BASE = 'https://api.github.com/repos';

interface GitHubMetrics {
  stars: number;
  forks: number;
  openIssues: number;
  lastCommit: string | null;
}

export async function getGitHubMetrics(
  repoPath: string
): Promise<GitHubMetrics | null> {
  const cacheKey = `github-${repoPath}`;
  const cached = getCached<GitHubMetrics>(cacheKey);
  if (cached !== null) return cached;

  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    // Use GitHub token if available
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`${GITHUB_API_BASE}/${repoPath}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn(`GitHub API error for ${repoPath}: ${response.status}`);
      return null;
    }

    const data: GitHubRepoResponse = await response.json();
    const metrics: GitHubMetrics = {
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      lastCommit: data.pushed_at,
    };

    setCache(cacheKey, metrics);
    return metrics;
  } catch (error) {
    console.error(`Failed to fetch GitHub data for ${repoPath}:`, error);
    return null;
  }
}

export function mergeGitHubMetrics(
  metrics: Partial<MCPMetrics>,
  github: GitHubMetrics | null
): MCPMetrics {
  return {
    npmDownloadsWeekly: metrics.npmDownloadsWeekly ?? 0,
    npmDownloadsChange: metrics.npmDownloadsChange ?? 0,
    githubStars: github?.stars ?? 0,
    githubForks: github?.forks ?? 0,
    openIssues: github?.openIssues ?? 0,
    lastCommit: github?.lastCommit ?? null,
  };
}
