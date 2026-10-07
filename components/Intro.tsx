'use client';
// First-visit intro styled as a GPS recording: acquire signal → Start → chase camera along the
// route while time, distance and pace tick → "Activity saved" → the dashboard slides in.
// Plays once per browser session; skipped entirely for reduced motion.
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { profile } from '@/content/site';
import { toMiles } from '@/lib/geo';
import { useStage } from './map/MapStage';
import { CheckIcon, GpsIcon, StopIcon } from './Icons';

const KEY = 'sk-intro-done';
const CHASE_MS = 8500;
const WALK_PACE = 20 * 60; // seconds per mile, used when the route isn't a real activity

type Phase = 'boot' | 'gps' | 'ready' | 'recording' | 'saved' | 'done';

const clock = (s: number) => [Math.floor(s / 3600), Math.floor(s / 60) % 60, Math.floor(s) % 60].map((n) => String(n).padStart(2, '0')).join(':');

/** `route` is the route to record; `pace` (seconds per mile) and `distance` (meters) are its real totals, if known. */
export default function Intro({ route = 'intro', pace = WALK_PACE, distance }: { route?: string; pace?: number; distance?: number }) {
  const { api, ready, routes, setRevealed } = useStage();
  const [phase, setPhase] = useState<Phase>('boot');
  const [t, setT] = useState(0);
  const finishing = useRef(false);
  const startButton = useRef<HTMLButtonElement>(null);
  const miles = toMiles(distance ?? routes[route].length) * t;
  const seconds = miles * pace;

  const reveal = useCallback(() => {
    try { sessionStorage.setItem(KEY, '1'); } catch {}
    setPhase('done');
    setRevealed(true);
  }, [setRevealed]);

  // Decide whether to play at all.
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === '1'; } catch {}
    if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) reveal();
    else setPhase('gps');
  }, [reveal]);

  // "Acquire" GPS once the map is up.
  useEffect(() => {
    if (phase !== 'gps' || !ready) return;
    const id = setTimeout(() => setPhase('ready'), 1100);
    return () => clearTimeout(id);
  }, [phase, ready]);

  useEffect(() => {
    if (phase === 'ready') startButton.current?.focus();
  }, [phase]);

  const finish = useCallback(() => {
    if (finishing.current) return;
    finishing.current = true;
    setPhase('saved');
    setTimeout(reveal, 1700);
  }, [reveal]);

  const start = async () => {
    if (!api.current) return;
    setPhase('recording');
    await api.current.chase(route, CHASE_MS, setT);
    finish();
  };

  const skip = useCallback(() => {
    api.current?.cancel();
    finishing.current = true;
    reveal();
  }, [api, reveal]);

  useEffect(() => {
    if (phase === 'done' || phase === 'boot') return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && skip();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, skip]);

  const stats = [
    { label: 'Time', value: clock(seconds) },
    { label: 'Distance', value: miles.toFixed(2), unit: 'mi' },
    { label: 'Avg pace', value: t > 0.02 ? clock(pace + Math.sin(t * 17) * 24).slice(3) : '--:--', unit: '/mi' },
  ];

  return (
    <AnimatePresence>
      {phase !== 'done' && phase !== 'boot' && (
        <motion.div className={`intro is-${phase}`} key="intro" exit={{ opacity: 0 }} transition={{ duration: 0.6 }} role="dialog" aria-label="Intro">
          <motion.div className="intro-hud" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 22, delay: 0.2 }}>
            {stats.map((s) => (
              <div key={s.label} className="intro-stat">
                <span>{s.label}</span>
                <b>
                  {s.value}
                  {s.unit && <small>{s.unit}</small>}
                </b>
              </div>
            ))}
          </motion.div>

          <div className="intro-center">
            <AnimatePresence mode="wait">
              {phase === 'gps' && (
                <motion.p key="gps" className="gps-chip" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <GpsIcon width={16} height={16} /> Acquiring GPS…
                </motion.p>
              )}
              {phase === 'ready' && (
                <motion.div key="ready" className="intro-ready" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
                  <p className="gps-chip is-locked"><span className="gps-led" /> GPS signal acquired</p>
                  <h1 className="intro-title">{profile.name}</h1>
                  <p className="intro-sub">{profile.tagline}</p>
                </motion.div>
              )}
              {phase === 'saved' && (
                <motion.div key="saved" className="saved-card" initial={{ opacity: 0, y: 30, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 240, damping: 20 }}>
                  <motion.span className="saved-check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}>
                    <CheckIcon width={26} height={26} />
                  </motion.span>
                  <p>Activity saved</p>
                  <span>{miles.toFixed(2)} mi · {clock(seconds)}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="intro-controls">
            <AnimatePresence mode="wait">
              {phase === 'ready' && (
                <motion.button key="start" ref={startButton} type="button" className="record-button" onClick={start} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
                  <span className="record-pulse" aria-hidden="true" />
                  Start
                </motion.button>
              )}
              {phase === 'recording' && (
                <motion.button key="stop" type="button" className="record-button is-stop" onClick={() => { api.current?.cancel(); }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} whileTap={{ scale: 0.92 }} aria-label="Finish">
                  <StopIcon width={30} height={30} />
                </motion.button>
              )}
            </AnimatePresence>
            {phase !== 'saved' && (
              <button type="button" className="skip-button" onClick={skip}>
                Skip intro
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
