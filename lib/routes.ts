// Server-side access to the generated route geometry. Pages pick the routes they need and
// pass them to client components as props, so the full JSON never ships to the browser.
import raw from '@/content/routes.json';
import { downsample, Track, type LngLat } from './geo';

const all = raw as unknown as Record<string, LngLat[]>;

export type RouteData = { id: string; coords: LngLat[]; length: number };

export function route(id: string, max = 400): RouteData {
  const coords = all[id];
  if (!coords) throw new Error(`Unknown route: ${id}`);
  return { id, coords: downsample(coords, max), length: new Track(coords).length };
}

/** A tiny version of a route for SVG thumbnails. */
export const thumb = (id: string) => downsample(all[id], 70);
