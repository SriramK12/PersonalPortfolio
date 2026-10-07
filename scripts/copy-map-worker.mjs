// MapLibre 6 runs its tile worker from a separate ES module that bundlers don't emit.
// Copy it into public/ so it is served next to the site (see setWorkerUrl in MapStage).
import { copyFile, mkdir } from 'node:fs/promises';

const dir = new URL('../public/vendor/', import.meta.url);
await mkdir(dir, { recursive: true });
await copyFile(new URL('../node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url), new URL('maplibre-gl-worker.mjs', dir));
