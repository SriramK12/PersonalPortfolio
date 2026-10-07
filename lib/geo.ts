export type LngLat = [number, number];

const R = 6371008.8; // mean earth radius, meters
const rad = (d: number) => (d * Math.PI) / 180;

export function distance(a: LngLat, b: LngLat) {
  const dLat = rad(b[1] - a[1]);
  const dLng = rad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function bearing(a: LngLat, b: LngLat) {
  const y = Math.sin(rad(b[0] - a[0])) * Math.cos(rad(b[1]));
  const x = Math.cos(rad(a[1])) * Math.sin(rad(b[1])) - Math.sin(rad(a[1])) * Math.cos(rad(b[1])) * Math.cos(rad(b[0] - a[0]));
  return (Math.atan2(y, x) * 180) / Math.PI;
}

/** A line with precomputed cumulative distances, so sampling along it is a binary search. */
export class Track {
  readonly coords: LngLat[];
  readonly cumulative: number[];
  readonly length: number;

  constructor(coords: LngLat[]) {
    this.coords = coords;
    this.cumulative = [0];
    for (let i = 1; i < coords.length; i++) this.cumulative.push(this.cumulative[i - 1] + distance(coords[i - 1], coords[i]));
    this.length = this.cumulative[this.cumulative.length - 1];
  }

  /** Point at fraction t (0..1) of the total length. */
  at(t: number): LngLat {
    const target = Math.min(Math.max(t, 0), 1) * this.length;
    let lo = 0;
    let hi = this.cumulative.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (this.cumulative[mid] < target) lo = mid;
      else hi = mid;
    }
    const span = this.cumulative[hi] - this.cumulative[lo] || 1;
    const f = (target - this.cumulative[lo]) / span;
    const a = this.coords[lo];
    const b = this.coords[hi];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  }
}

export function bounds(lines: LngLat[][]): [LngLat, LngLat] {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  for (const line of lines) for (const [x, y] of line) {
    if (x < w) w = x;
    if (x > e) e = x;
    if (y < s) s = y;
    if (y > n) n = y;
  }
  return [[w, s], [e, n]];
}

/** Evenly thin a line to at most `max` points (keeps first and last). */
export function downsample(coords: LngLat[], max: number): LngLat[] {
  if (coords.length <= max) return coords;
  const step = (coords.length - 1) / (max - 1);
  return Array.from({ length: max }, (_, i) => coords[Math.round(i * step)]);
}

export const toMiles = (m: number) => m / 1609.344;

/** Walking time at 3 mph, formatted like an activity duration. */
export function walkTime(m: number) {
  const mins = Math.round((toMiles(m) / 3) * 60);
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m` : `${mins}m`;
}
