'use client';
// Home page: a world map with a parked plane. Start → pick a destination → the plane flies there
// along the great circle, the camera dives in, and that section of the site opens. The camera
// position is handed to the next page, so the landing continues straight into its map.
import 'maplibre-gl/dist/maplibre-gl.css';
import type { ExpressionSpecification, Map as MLMap, Marker } from 'maplibre-gl';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Destination } from '@/content/site';
import { bearing, bounds, distance, greatCircle, toMiles, Track, type LngLat } from '@/lib/geo';
import { createMap, reducedMotion, saveCamera } from '@/lib/map';
import { PlaneIcon } from '../Icons';

const ORANGE = '#fc4c02';
const PLANE_KEY = 'sk-plane'; // the destination the plane last landed at
const PLANE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8c.9 0 1.5 1 1.5 2.2v5.3l8 4.6v2.2l-8-2.4v4.6l2.4 1.8v1.6L12 20.8l-3.9.9v-1.6l2.4-1.8v-4.6l-8 2.4v-2.2l8-4.6V4c0-1.2.6-2.2 1.5-2.2z"/></svg>';

type Phase = 'idle' | 'choose' | 'flying';

const trailGradient = (p: number): ExpressionSpecification =>
  ['step', ['line-progress'], ORANGE, Math.max(p, 0.00001), 'rgba(0,0,0,0)'];

const line = (coords: LngLat[]) => ({ type: 'Feature' as const, properties: {}, geometry: { type: 'LineString' as const, coordinates: coords } });

export default function FlightDeck({ name, tagline, destinations, home }: { name: string; tagline: string; destinations: Destination[]; home: string }) {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const plane = useRef<Marker | null>(null);
  const anim = useRef(0);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [origin, setOrigin] = useState<Destination>(() => destinations.find((d) => d.id === home)!);
  const [target, setTarget] = useState<Destination | null>(null);
  const [miles, setMiles] = useState(0);
  const originRef = useRef(origin);
  originRef.current = origin;

  // Frame every destination with room for the overlay.
  const frameWorld = useCallback((duration: number) => {
    const map = mapRef.current;
    if (!map) return;
    const { clientWidth: w, clientHeight: h } = map.getContainer();
    const padding = w >= 900 ? { top: 140, bottom: 230, left: 120, right: 120 } : { top: 110, bottom: Math.min(340, h * 0.45), left: 40, right: 40 };
    const cam = map.cameraForBounds(bounds([destinations.map((d) => d.center)]), { padding });
    if (cam) map.flyTo({ ...cam, bearing: 0, pitch: 0, duration: reducedMotion() ? 0 : duration, essential: true });
  }, [destinations]);

  const showPreview = useCallback((to: Destination | null) => {
    const map = mapRef.current;
    const src = map?.getSource('preview') as { setData?: (d: unknown) => void } | undefined;
    if (!map || !src?.setData) return;
    const from = originRef.current;
    src.setData(line(to && to.id !== from.id ? greatCircle(from.center, to.center, 96) : []));
    if (to && to.id !== from.id) plane.current?.setRotation(bearing(from.center, greatCircle(from.center, to.center, 96)[2]));
  }, []);

  // Build the map once.
  useEffect(() => {
    let disposed = false;
    try {
      const last = sessionStorage.getItem(PLANE_KEY);
      const found = destinations.find((d) => d.id === last);
      if (found) setOrigin(found);
    } catch {}

    (async () => {
      const start = originRef.current.center;
      const { ml, map } = await createMap(container.current!, { center: [start[0], start[1] - 6], zoom: 2.2, bearing: 0, pitch: 0 });
      if (disposed) return map.remove();
      mapRef.current = map;

      const planeEl = Object.assign(document.createElement('div'), { className: 'plane-marker', innerHTML: `<span class="plane-shadow"></span>${PLANE_SVG}` });
      plane.current = new ml.Marker({ element: planeEl, rotationAlignment: 'map', pitchAlignment: 'map' }).setLngLat(start).setRotation(45).addTo(map);

      for (const d of destinations) {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'dest-pin';
        el.setAttribute('aria-label', `Fly to ${d.label}, ${d.place}`);
        el.innerHTML = `<span class="dest-pin-dot"></span><span class="dest-pin-label"><b>${d.code}</b> ${d.label}</span>`;
        el.addEventListener('mouseenter', () => showPreview(d));
        el.addEventListener('click', () => window.dispatchEvent(new CustomEvent('sk-fly', { detail: d.id })));
        new ml.Marker({ element: el, anchor: 'left', offset: [-7, 0] }).setLngLat(d.center).addTo(map);
      }

      map.on('style.load', () => {
        map.addSource('preview', { type: 'geojson', data: line([]) });
        map.addLayer({ id: 'preview', type: 'line', source: 'preview', layout: { 'line-cap': 'round' }, paint: { 'line-color': '#ffffff', 'line-opacity': 0.55, 'line-width': 1.6, 'line-dasharray': [1.5, 2.5] } });
        map.addSource('trail', { type: 'geojson', lineMetrics: true, data: line([]) });
        map.addLayer({ id: 'trail-glow', type: 'line', source: 'trail', layout: { 'line-cap': 'round' }, paint: { 'line-width': 14, 'line-blur': 9, 'line-opacity': 0.35, 'line-gradient': trailGradient(0) } });
        map.addLayer({ id: 'trail', type: 'line', source: 'trail', layout: { 'line-cap': 'round' }, paint: { 'line-width': 3, 'line-gradient': trailGradient(0) } });
      });
      map.once('load', () => !disposed && setReady(true));
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(anim.current);
      const map = mapRef.current;
      if (map) {
        saveCamera(map);
        map.remove();
      }
      mapRef.current = null;
    };
    // Built once per visit; destinations are static.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Settle on the world view once the map is up.
  useEffect(() => {
    if (ready) frameWorld(2600);
  }, [ready, frameWorld]);

  // Keep the parked plane on the current origin.
  useEffect(() => {
    plane.current?.setLngLat(origin.center);
  }, [origin]);

  const fly = useCallback((id: string) => {
    const map = mapRef.current;
    const to = destinations.find((d) => d.id === id);
    if (!map || !to || phase === 'flying') return;
    const from = originRef.current;
    setTarget(to);
    setPhase('flying');
    showPreview(null);
    try { sessionStorage.setItem(PLANE_KEY, to.id); } catch {}

    const land = () => {
      map.flyTo({ center: to.center, zoom: 9.5, pitch: 40, bearing: 0, duration: reducedMotion() ? 0 : 1600, essential: true });
      map.once('moveend', () => router.push(to.href));
    };
    if (reducedMotion() || to.id === from.id) return land();

    const path = greatCircle(from.center, to.center, 160);
    const track = new Track(path);
    const totalMiles = toMiles(distance(from.center, to.center));
    (map.getSource('trail') as unknown as { setData(d: unknown): void }).setData(line(path));
    const ms = Math.min(2400 + totalMiles * 1.1, 5200);

    // Frame the whole route, then fly the plane along it.
    const { clientWidth: w } = map.getContainer();
    const cam = map.cameraForBounds(bounds([path]), { padding: w >= 900 ? { top: 150, bottom: 150, left: 160, right: 160 } : 70 });
    if (cam) map.flyTo({ ...cam, bearing: 0, pitch: 0, duration: 1100, essential: true });

    const t0 = performance.now() + 900;
    const tick = (now: number) => {
      const raw = Math.max(0, Math.min((now - t0) / ms, 1));
      const t = raw < 0.5 ? 2 * raw * raw : 1 - (-2 * raw + 2) ** 2 / 2; // ease in and out, like a real flight
      const p = track.at(t);
      plane.current?.setLngLat(p).setRotation(bearing(p, track.at(Math.min(t + 0.01, 1))));
      map.setPaintProperty('trail', 'line-gradient', trailGradient(t));
      map.setPaintProperty('trail-glow', 'line-gradient', trailGradient(t));
      setMiles(totalMiles * (1 - t));
      if (raw < 1) anim.current = requestAnimationFrame(tick);
      else land();
    };
    anim.current = requestAnimationFrame(tick);
  }, [destinations, phase, router, showPreview]);

  // Destination pins live outside React (map markers), so they signal through a window event.
  useEffect(() => {
    const onFly = (e: Event) => phase === 'choose' && fly((e as CustomEvent<string>).detail);
    window.addEventListener('sk-fly', onFly);
    return () => window.removeEventListener('sk-fly', onFly);
  }, [fly, phase]);

  return (
    <>
      <div className={`map-stage${ready ? ' is-ready' : ''} flight-map is-${phase}`} ref={container} aria-hidden="true" />
      <div className="map-vignette is-home" aria-hidden="true" />

      <div className={`flight-deck is-${phase}`}>
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div key="hero" className="home-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24, filter: 'blur(6px)' }} transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
              <p className="gps-chip is-locked"><span className="gps-led" /> Cleared for takeoff · {origin.code}</p>
              <h1 className="intro-title">{name}</h1>
              <p className="intro-sub">{tagline}</p>
              <motion.button type="button" className="record-button" onClick={() => setPhase('choose')} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.3 }}>
                <span className="record-pulse" aria-hidden="true" />
                Start
              </motion.button>
            </motion.div>
          )}

          {phase === 'choose' && (
            <motion.div key="choose" className="boarding" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
              <h2>Where to?</h2>
              <ul className="boarding-list">
                {destinations.map((d, i) => (
                  <motion.li key={d.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i, type: 'spring', stiffness: 260, damping: 24 }}>
                    <button type="button" className="boarding-pass" onClick={() => fly(d.id)} onMouseEnter={() => showPreview(d)} onFocus={() => showPreview(d)} onMouseLeave={() => showPreview(null)}>
                      <span className="pass-route">
                        <b>{origin.code}</b>
                        <PlaneIcon width={16} height={16} />
                        <b>{d.code}</b>
                      </span>
                      <span className="pass-label">{d.label}</span>
                      <span className="pass-place">{d.id === origin.id ? 'You are here' : d.place}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              <button type="button" className="skip-button" onClick={() => setPhase('idle')}>Back</button>
            </motion.div>
          )}

          {phase === 'flying' && target && (
            <motion.div key="flying" className="flight-chip" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <b>{origin.code}</b>
              <PlaneIcon width={16} height={16} />
              <b>{target.code}</b>
              <span>{target.id === origin.id ? 'Landing' : `${Math.round(miles).toLocaleString()} mi to go`}</span>
              <span className="flight-dest">{target.label}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
