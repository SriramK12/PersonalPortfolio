'use client';
// The full-screen map behind every page. Each page mounts its own stage with the routes it
// needs; the camera position is carried across pages through sessionStorage so navigation
// reads as one continuous flight.
import 'maplibre-gl/dist/maplibre-gl.css';
import type { ExpressionSpecification, Map as MLMap, Marker } from 'maplibre-gl';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { useMotionValue, type MotionValue } from 'motion/react';
import { bearing, bounds, Track, type LngLat } from '@/lib/geo';
import type { RouteData } from '@/lib/routes';
import RouteHud, { type RouteStats } from './RouteHud';

const ORANGE = '#fc4c02';
const STYLE = 'https://tiles.openfreemap.org/styles/dark';
const CAMERA_KEY = 'sk-camera';
const DRAW_MS = 1900;

export type Pin = { routeId: string; center: LngLat; label: string; side?: 'left' | 'right' };

export type StageApi = {
  map: MLMap;
  /** Fly to the start of a route, then follow it with a chase camera. Resolves when done or cancelled. */
  chase(id: string, ms: number, onFrame?: (t: number) => void): Promise<void>;
  cancel(): void;
};

type StageContext = {
  active: string | null;
  setActive(id: string | null): void;
  ready: boolean;
  revealed: boolean;
  setRevealed(v: boolean): void;
  progress: MotionValue<number>;
  routes: Record<string, RouteData>;
  api: RefObject<StageApi | null>;
};

const Ctx = createContext<StageContext | null>(null);
export function useStage() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStage outside MapStage');
  return ctx;
}

const reducedMotion = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Map padding that keeps routes clear of the content panel, measured against the map itself. */
function padding(map: MLMap, revealed: boolean) {
  const { clientWidth: w, clientHeight: h } = map.getContainer();
  const pad = !revealed
    ? { top: 120, bottom: 120, left: 60, right: 60 }
    : w >= 900
      ? { top: 120, bottom: 110, left: Math.min(580, w * 0.46), right: 80 }
      : { top: 80, bottom: Math.round(h * 0.56), left: 36, right: 36 };
  // Never let padding swallow the map, or the fit collapses to a far-out view.
  const sx = Math.min(1, (w * 0.75) / (pad.left + pad.right));
  const sy = Math.min(1, (h * 0.75) / (pad.top + pad.bottom));
  return { top: pad.top * sy, bottom: pad.bottom * sy, left: pad.left * sx, right: pad.right * sx };
}

const gradient = (p: number, color = ORANGE): ExpressionSpecification =>
  ['step', ['line-progress'], color, Math.max(p, 0.00001), 'rgba(0,0,0,0)'];

// MapLibre owns marker opacity (it fades markers behind the globe), so toggle visibility instead.
const show = (marker: Marker, on: boolean) => marker.getElement().classList.toggle('is-hidden', !on);

const lerpAngle = (a: number, b: number, t: number) => a + ((((b - a) % 360) + 540) % 360 - 180) * t;

export default function MapStage({
  routes: routeList,
  initial = null,
  pins = [],
  labels = {},
  stats,
  intro = false,
  tracer = true,
  children,
}: {
  routes: RouteData[];
  initial?: string | null;
  pins?: Pin[];
  labels?: Record<string, string>;
  stats?: Record<string, RouteStats>;
  intro?: boolean;
  tracer?: boolean;
  children: ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const api = useRef<StageApi | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<string | null>(initial);
  const [revealed, setRevealed] = useState(!intro);
  const progress = useMotionValue(0);
  const routes = useMemo(() => Object.fromEntries(routeList.map((r) => [r.id, r])), [routeList]);
  const tracks = useMemo(() => Object.fromEntries(routeList.map((r) => [r.id, new Track(r.coords)])), [routeList]);
  const anim = useRef(0); // current requestAnimationFrame id
  const dot = useRef<Marker | null>(null);
  const ends = useRef<Marker[]>([]);
  const activeRef = useRef(active);
  activeRef.current = active;
  const revealedRef = useRef(revealed);
  revealedRef.current = revealed;

  const chaseDone = useRef<(() => void) | null>(null);
  const stop = useCallback(() => {
    cancelAnimationFrame(anim.current);
    chaseDone.current?.();
    chaseDone.current = null;
  }, []);

  // Paint every route, emphasizing the active one.
  const paint = useCallback((id: string | null, drawn: number, solo = false) => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    for (const r of routeList) {
      const on = r.id === id;
      const dim = id !== null && !on;
      if (!map.getLayer(`r-${r.id}`)) continue;
      map.setPaintProperty(`r-${r.id}-case`, 'line-opacity', on ? 1 : 0);
      map.setPaintProperty(`r-${r.id}-glow`, 'line-opacity', on ? 0.28 : 0);
      map.setPaintProperty(`r-${r.id}-glow`, 'line-gradient', gradient(on ? drawn : 1));
      map.setPaintProperty(`r-${r.id}`, 'line-width', on ? 4.5 : 3);
      map.setPaintProperty(`r-${r.id}`, 'line-opacity', on ? 1 : solo ? 0 : dim ? 0.32 : 0.85);
      if (!r.dashed) map.setPaintProperty(`r-${r.id}`, 'line-gradient', gradient(on ? drawn : 1));
    }
    if (id && map.getLayer(`r-${id}`)) for (const suffix of ['-glow', '-case', '']) map.moveLayer(`r-${id}${suffix}`);
  }, [routeList]);

  const setDrawn = useCallback((id: string, p: number) => {
    const map = mapRef.current;
    if (map?.getLayer(`r-${id}`) && !routes[id]?.dashed) map.setPaintProperty(`r-${id}`, 'line-gradient', gradient(p));
    if (map?.getLayer(`r-${id}-glow`)) map.setPaintProperty(`r-${id}-glow`, 'line-gradient', gradient(p));
  }, [routes]);

  const moveDot = useCallback((p: LngLat | null) => {
    if (!dot.current) return;
    show(dot.current, !!p);
    if (p) dot.current.setLngLat(p);
  }, []);

  // Draw the active route, then loop a GPS dot along it.
  const animateRoute = useCallback((id: string) => {
    stop();
    const track = tracks[id];
    if (reducedMotion()) {
      setDrawn(id, 1);
      progress.set(1);
      moveDot(null);
      return;
    }
    const t0 = performance.now();
    const loopMs = Math.min(Math.max(track.length / 0.9, 9000), 22000);
    const tick = (now: number) => {
      const t = (now - t0) / DRAW_MS;
      if (t < 1) {
        const e = 1 - Math.pow(1 - t, 3);
        setDrawn(id, e);
        progress.set(e);
        moveDot(track.at(e));
      } else {
        setDrawn(id, 1);
        progress.set(1);
        if (!tracer) return moveDot(null);
        moveDot(track.at(((now - t0 - DRAW_MS) % loopMs) / loopMs));
      }
      anim.current = requestAnimationFrame(tick);
    };
    anim.current = requestAnimationFrame(tick);
  }, [moveDot, progress, setDrawn, stop, tracer, tracks]);

  const placeEnds = useCallback((id: string | null) => {
    const [start, finish] = ends.current;
    if (!start) return;
    const coords = id ? routes[id].coords : null;
    if (!coords) {
      show(start, false);
      show(finish, false);
      return;
    }
    const a = coords[0];
    const b = coords[coords.length - 1];
    const loop = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) < 0.0008;
    show(start.setLngLat(a), true);
    show(finish.setLngLat(b), !loop && !routes[id!].dashed);
  }, [routes]);

  // Frame the active route (or everything), then draw it.
  const focus = useCallback((id: string | null) => {
    const map = mapRef.current;
    if (!map) return;
    stop();
    const lines = id ? [routes[id].coords] : routeList.map((r) => r.coords);
    const cam = map.cameraForBounds(bounds(lines), { padding: padding(map, revealedRef.current), maxZoom: 15.2, bearing: id ? -14 : 0 });
    if (!cam) return;
    // On the globe, bounds fitting leaves continent-scale views too far out; tighten them.
    if (!id && cam.zoom !== undefined && cam.zoom < 3.6) cam.zoom = Math.min(cam.zoom + 1, 3.6);
    const pitch = id && !routes[id].dashed ? 48 : 0;
    paint(id, id ? 0 : 1);
    placeEnds(id);
    moveDot(null);
    progress.set(0);
    if (reducedMotion()) {
      map.jumpTo({ ...cam, pitch });
      if (id) animateRoute(id);
      return;
    }
    map.flyTo({ ...cam, pitch, duration: 2300, curve: 1.5, essential: true });
    if (id) map.once('moveend', () => activeRef.current === id && animateRoute(id));
    else progress.set(1);
  }, [animateRoute, moveDot, paint, placeEnds, progress, routeList, routes, stop]);

  // Create the map once.
  useEffect(() => {
    let disposed = false;

    (async () => {
      const ml = await import('maplibre-gl');
      if (disposed || !container.current) return;
      ml.setWorkerUrl(`${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH}/vendor/maplibre-gl-worker.mjs`);

      let saved: { center: LngLat; zoom: number; bearing: number; pitch: number } | null = null;
      try { saved = JSON.parse(sessionStorage.getItem(CAMERA_KEY) || 'null'); } catch {}
      const first = routeList[0].coords[0];

      const map = new ml.Map({
        container: container.current,
        style: STYLE,
        center: saved?.center ?? first,
        zoom: saved?.zoom ?? 1.6,
        bearing: saved?.bearing ?? 0,
        pitch: saved?.pitch ?? 0,
        maxPitch: 70,
        attributionControl: { compact: true },
        cooperativeGestures: false,
        dragRotate: true,
      });
      mapRef.current = map;
      map.addControl(new ml.NavigationControl({ visualizePitch: true }), 'bottom-right');

      const el = (cls: string) => Object.assign(document.createElement('div'), { className: cls });
      dot.current = new ml.Marker({ element: el('gps-dot'), pitchAlignment: 'map' }).setLngLat(first).addTo(map);
      show(dot.current!, false);
      ends.current = [
        new ml.Marker({ element: el('route-end route-start') }).setLngLat(first).addTo(map),
        new ml.Marker({ element: el('route-end route-finish') }).setLngLat(first).addTo(map),
      ];
      for (const m of ends.current) show(m, false);

      for (const pin of pins) {
        const node = el('city-pin');
        const left = pin.side === 'left';
        if (left) node.classList.add('is-left');
        node.innerHTML = `<span class="city-pin-dot"></span><span class="city-pin-label">${pin.label}</span>`;
        node.addEventListener('click', () => setActive(pin.routeId));
        // Offset so the dot, not the label, sits on the coordinate.
        new ml.Marker({ element: node, anchor: left ? 'right' : 'left', offset: [left ? 7 : -7, 0] }).setLngLat(pin.center).addTo(map);
      }

      map.on('style.load', () => {
        map.setProjection({ type: 'globe' });
        for (const r of routeList) {
          if (map.getSource(`r-${r.id}`)) continue;
          map.addSource(`r-${r.id}`, { type: 'geojson', lineMetrics: true, data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: r.coords } } });
          const layout = { 'line-join': 'round', 'line-cap': 'round' } as const;
          map.addLayer({ id: `r-${r.id}-glow`, type: 'line', source: `r-${r.id}`, layout, paint: { 'line-width': 16, 'line-blur': 10, 'line-opacity': 0, 'line-gradient': gradient(1) } });
          map.addLayer({ id: `r-${r.id}-case`, type: 'line', source: `r-${r.id}`, layout, paint: { 'line-width': 9, 'line-color': '#0b0b0d', 'line-opacity': 0 } });
          map.addLayer({
            id: `r-${r.id}`, type: 'line', source: `r-${r.id}`, layout,
            paint: r.dashed
              ? { 'line-color': ORANGE, 'line-width': 3, 'line-dasharray': [1.2, 1.6] }
              : { 'line-width': 3, 'line-gradient': gradient(1) },
          });
          map.on('click', `r-${r.id}`, () => setActive(r.id));
          map.on('mouseenter', `r-${r.id}`, () => (map.getCanvas().style.cursor = 'pointer'));
          map.on('mouseleave', `r-${r.id}`, () => (map.getCanvas().style.cursor = ''));
        }
        // Before an intro reveals the page, keep the map clean: no routes yet.
        paint(activeRef.current, revealedRef.current ? 1 : 0, !revealedRef.current);
      });

      map.once('load', () => {
        if (disposed) return;
        setReady(true);
      });


      api.current = {
        map,
        cancel() {
          map.stop();
          stop();
        },
        chase(id, ms, onFrame) {
          stop();
          const track = tracks[id];
          // Street level for a few km, pulling back for longer activities so the chase stays readable.
          const zoom = Math.min(15, Math.max(12, 15 - Math.log2(Math.max(track.length / 8000, 1))));
          paint(id, 0, true);
          placeEnds(id);
          return new Promise<void>((resolve) => {
            chaseDone.current = resolve;
            map.flyTo({ center: track.at(0), zoom, pitch: 62, bearing: bearing(track.at(0), track.at(0.01)), duration: 2200, essential: true });
            map.once('moveend', () => {
              if (chaseDone.current !== resolve) return; // cancelled during the approach
              let brg = map.getBearing();
              const t0 = performance.now();
              const tick = (now: number) => {
                const t = Math.min((now - t0) / ms, 1);
                const p = track.at(t);
                brg = lerpAngle(brg, bearing(p, track.at(Math.min(t + 0.015, 1))), 0.045);
                map.jumpTo({ center: p, bearing: brg, pitch: 62, zoom });
                setDrawn(id, t);
                moveDot(p);
                progress.set(t);
                onFrame?.(t);
                if (t < 1) anim.current = requestAnimationFrame(tick);
                else stop();
              };
              anim.current = requestAnimationFrame(tick);
            });
          });
        },
      };
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(anim.current);
      const map = mapRef.current;
      if (map) {
        const c = map.getCenter();
        try {
          sessionStorage.setItem(CAMERA_KEY, JSON.stringify({ center: [c.lng, c.lat], zoom: map.getZoom(), bearing: map.getBearing(), pitch: map.getPitch() }));
        } catch {}
        map.remove();
      }
      mapRef.current = null;
      api.current = null;
    };
    // The stage is mounted per page with fixed routes; it never needs to rebuild.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to the active route once the map is ready and the content is showing.
  useEffect(() => {
    if (ready && revealed) focus(active);
  }, [active, ready, revealed, focus]);

  // Reframe when the window changes shape.
  useEffect(() => {
    if (!ready || !revealed) return;
    let t = 0;
    const onResize = () => { clearTimeout(t); t = window.setTimeout(() => focus(activeRef.current), 250); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [ready, revealed, focus]);

  // On phones the sheet covers the map once scrolled; bring the map back into view on selection.
  const select = useCallback((id: string | null) => {
    setActive(id);
    if (id && window.innerWidth < 900 && window.scrollY > window.innerHeight * 0.2) {
      // Wait a frame so expanding rows don't interrupt the scroll.
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' }));
    }
  }, []);

  const value = useMemo<StageContext>(
    () => ({ active, setActive: select, ready, revealed, setRevealed, progress, routes, api }),
    [active, select, ready, revealed, progress, routes],
  );

  return (
    <Ctx.Provider value={value}>
      <div className={`map-stage${ready ? ' is-ready' : ''}`} ref={container} aria-hidden="true" />
      <div className="map-vignette" aria-hidden="true" />
      {revealed && <RouteHud labels={labels} stats={stats} />}
      {children}
    </Ctx.Provider>
  );
}
