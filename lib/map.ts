// Shared MapLibre setup for every map on the site: worker, dark style, globe projection, controls,
// and the camera hand-off that makes navigating between pages read as one continuous flight.
import type { Map as MLMap } from 'maplibre-gl';
import type { LngLat } from './geo';

const STYLE = 'https://tiles.openfreemap.org/styles/dark';
const CAMERA_KEY = 'sk-camera';

type Camera = { center: LngLat; zoom: number; bearing: number; pitch: number };

export const reducedMotion = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Create a map in `container`, starting from the camera the previous page left behind (or `fallback`). */
export async function createMap(container: HTMLElement, fallback: Camera) {
  const ml = await import('maplibre-gl');
  ml.setWorkerUrl(`${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH}/vendor/maplibre-gl-worker.mjs`);

  let saved: Camera | null = null;
  try { saved = JSON.parse(sessionStorage.getItem(CAMERA_KEY) || 'null'); } catch {}
  const cam = saved ?? fallback;

  const map = new ml.Map({
    container,
    style: STYLE,
    center: cam.center,
    zoom: cam.zoom,
    bearing: cam.bearing,
    pitch: cam.pitch,
    maxPitch: 70,
    attributionControl: { compact: true },
  });
  map.addControl(new ml.NavigationControl({ visualizePitch: true }), 'bottom-right');
  map.on('style.load', () => map.setProjection({ type: 'globe' }));
  return { ml, map };
}

/** Remember where the camera is, so the next page's map starts from here. */
export function saveCamera(map: MLMap) {
  const c = map.getCenter();
  try {
    sessionStorage.setItem(CAMERA_KEY, JSON.stringify({ center: [c.lng, c.lat], zoom: map.getZoom(), bearing: map.getBearing(), pitch: map.getPitch() }));
  } catch {}
}
