import { NpmDownloadsResponse, NpmRangeResponse } from '../types';
import { getCached, setCache } from './cache';

const NPM_API_BASE = 'https://api.npmjs.org/downloads';

export async function getWeeklyDownloads(
  packageName: string
): Promise<number | null> {
  const cacheKey = `npm-weekly-${packageName}`;
  const cached = getCached<number>(cacheKey);
  if (cached !== null) return cached;

  try {
    const encodedPackage = encodeURIComponent(packageName);
    const response = await fetch(
      `${NPM_API_BASE}/point/last-week/${encodedPackage}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.warn(`npm API error for ${packageName}: ${response.status}`);
      return null;
    }

    const data: NpmDownloadsResponse = await response.json();
    setCache(cacheKey, data.downloads);
    return data.downloads;
  } catch (error) {
    console.error(`Failed to fetch npm downloads for ${packageName}:`, error);
    return null;
  }
}

export async function getDownloadsTrend(
  packageName: string
): Promise<number[]> {
  const cacheKey = `npm-trend-${packageName}`;
  const cached = getCached<number[]>(cacheKey);
  if (cached !== null) return cached;

  try {
    const encodedPackage = encodeURIComponent(packageName);
    const response = await fetch(
      `${NPM_API_BASE}/range/last-month/${encodedPackage}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.warn(`npm API trend error for ${packageName}: ${response.status}`);
      return [];
    }

    const data: NpmRangeResponse = await response.json();
    // Get last 7 days
    const trend = data.downloads.slice(-7).map((d) => d.downloads);
    setCache(cacheKey, trend);
    return trend;
  } catch (error) {
    console.error(`Failed to fetch npm trend for ${packageName}:`, error);
    return [];
  }
}

export async function getDownloadsChangePercent(
  packageName: string
): Promise<number> {
  try {
    const encodedPackage = encodeURIComponent(packageName);
    const response = await fetch(
      `${NPM_API_BASE}/range/last-month/${encodedPackage}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) return 0;

    const data: NpmRangeResponse = await response.json();
    const downloads = data.downloads;

    if (downloads.length < 14) return 0;

    // Compare last 7 days vs previous 7 days
    const lastWeek = downloads.slice(-7).reduce((sum, d) => sum + d.downloads, 0);
    const previousWeek = downloads.slice(-14, -7).reduce((sum, d) => sum + d.downloads, 0);

    if (previousWeek === 0) return lastWeek > 0 ? 100 : 0;

    return Math.round(((lastWeek - previousWeek) / previousWeek) * 100);
  } catch {
    return 0;
  }
}
