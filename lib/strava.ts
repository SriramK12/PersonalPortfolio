// Server-side access to real Strava activities fetched at build time (scripts/fetch-strava.mjs).
// The file is absent until Strava is connected; every caller must handle an empty list.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { downsample, toMiles, type LngLat } from './geo';

export type StravaActivity = {
  id: string;
  name: string;
  sport: string;
  date: string; // YYYY-MM-DD, athlete's local time
  distance: number; // meters
  movingTime: number; // seconds
  coords: LngLat[]; // already trimmed at both ends
};

const FILE = join(process.cwd(), 'content', 'strava.json');

export function stravaActivities(): StravaActivity[] {
  if (!existsSync(FILE)) return [];
  try {
    return JSON.parse(readFileSync(FILE, 'utf8')) as StravaActivity[];
  } catch {
    return [];
  }
}

export const stravaThumb = (a: StravaActivity) => downsample(a.coords, 70);

/** Strava sport types grouped into a few filter labels. */
export function sportGroup(sport: string) {
  if (/Run/.test(sport)) return 'Runs';
  if (/Ride|Cycl|Bike/.test(sport)) return 'Rides';
  if (/Hike/.test(sport)) return 'Hikes';
  if (/Walk/.test(sport)) return 'Walks';
  return 'Other';
}

export function stravaNote(a: StravaActivity) {
  const date = new Date(`${a.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${toMiles(a.distance).toFixed(1)} mi · ${date}`;
}
