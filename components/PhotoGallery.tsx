'use client';
// Photo grid for the Activities page, plus a full-screen viewer. Opening a photo (from the grid
// or its map pin) flies the map there. Videos and Live Photos play as silent loops.
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { photoSrc, videoSrc, type Photo } from '@/content/photos';
import { useStage } from './map/MapStage';
import { ArrowIcon, BackIcon, PinIcon } from './Icons';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const { photo, setPhoto } = useStage();
  const index = photos.findIndex((p) => p.id === photo);
  const current = index >= 0 ? photos[index] : null;
  // The viewer is portaled to <body>: the panel's animated transform/filter would trap a fixed overlay.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const step = useCallback((d: number) => {
    if (index < 0) return;
    setPhoto(photos[(index + d + photos.length) % photos.length].id);
  }, [index, photos, setPhoto]);

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhoto(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, setPhoto, step]);

  return (
    <>
      <ul className="photo-grid">
        {photos.map((p, i) => (
          <motion.li key={p.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.025, 0.5), type: 'spring', stiffness: 300, damping: 26 }}>
            <button type="button" className={`photo-tile${photo === p.id ? ' is-active' : ''}`} onClick={() => setPhoto(p.id)} aria-label={`${p.caption}, ${p.place}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={base + photoSrc(p, 'thumb')} alt="" loading="lazy" />
              {p.video && <span className="photo-badge">Live</span>}
            </button>
          </motion.li>
        ))}
      </ul>

      {mounted && createPortal(
        <AnimatePresence>
          {current && (
            <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={current.caption} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPhoto(null)}>
              <motion.figure
                key={current.id}
                className="lightbox-figure"
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                onClick={(e) => e.stopPropagation()}
              >
                {current.video ? (
                  <video src={base + videoSrc(current)} poster={base + photoSrc(current)} autoPlay loop muted playsInline width={current.width} height={current.height} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={base + photoSrc(current)} alt={current.caption} width={current.width} height={current.height} />
                )}
                <figcaption>
                  <b>{current.caption}</b>
                  <span><PinIcon width={13} height={13} /> {current.place}{current.date && ` · ${current.date}`}</span>
                </figcaption>
              </motion.figure>
              <button type="button" className="lightbox-nav is-prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo"><BackIcon /></button>
              <button type="button" className="lightbox-nav is-next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo"><ArrowIcon /></button>
              <button type="button" className="lightbox-close" onClick={() => setPhoto(null)} aria-label="Close">×</button>
              <span className="lightbox-count">{index + 1} / {photos.length}</span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
