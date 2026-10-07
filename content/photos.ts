// Owner-supplied photos, processed for the web: resized, all EXIF/GPS metadata stripped,
// videos silent. Pins are rounded to about 1 km so none marks an exact address.
export type Photo = { id: string; caption: string; place: string; center: [number, number]; date: string; width: number; height: number; video: boolean };

export const photos: Photo[] = [
  { id: "acatenango-start", caption: "Start of the Acatenango hike", place: "Acatenango, Guatemala", center: [-90.88, 14.49], date: "Aug 2026", width: 1600, height: 1200, video: false },
  { id: "acatenango-camp", caption: "Acatenango base camp", place: "Acatenango, Guatemala", center: [-90.87, 14.51], date: "Aug 2026", width: 1600, height: 1200, video: false },
  { id: "acatenango-clouds", caption: "Volcano above the clouds", place: "Acatenango, Guatemala", center: [-90.86, 14.5], date: "Aug 2026", width: 1600, height: 1200, video: false },
  { id: "acatenango-morning", caption: "Morning on Acatenango", place: "Acatenango, Guatemala", center: [-90.89, 14.5], date: "Aug 2026", width: 1600, height: 1200, video: false },
  { id: "fuego-night", caption: "Volcán de Fuego erupting at night", place: "Acatenango, Guatemala", center: [-90.86, 14.48], date: "Aug 2026", width: 1600, height: 1086, video: false },
  { id: "acatenango-peak-view", caption: "Volcano through the pines", place: "Acatenango, Guatemala", center: [-90.88, 14.51], date: "Aug 2026", width: 1200, height: 1600, video: false },
  { id: "acatenango-dog", caption: "Trail dog on Acatenango", place: "Acatenango, Guatemala", center: [-90.87, 14.49], date: "Aug 2026", width: 1200, height: 1600, video: false },
  { id: "acatenango-above", caption: "Above the clouds", place: "Acatenango, Guatemala", center: [-90.87, 14.5], date: "Aug 2026", width: 1200, height: 1600, video: false },
  { id: "acatenango-night", caption: "Night above the clouds", place: "Acatenango, Guatemala", center: [-90.89, 14.48], date: "Aug 2026", width: 1600, height: 1200, video: false },
  { id: "fuego-eruption", caption: "Fuego erupting (video)", place: "Acatenango, Guatemala", center: [-90.85, 14.48], date: "Aug 2026", width: 478, height: 850, video: true },
  { id: "antigua-dunkin", caption: "Dunkin' in Antigua", place: "Antigua, Guatemala", center: [-90.73, 14.56], date: "Aug 2026", width: 1600, height: 1200, video: false },
  { id: "antigua-dinner", caption: "First dinner in Guatemala", place: "Antigua, Guatemala", center: [-90.74, 14.55], date: "Aug 2026", width: 1200, height: 1600, video: false },
  { id: "antigua-gear-up", caption: "Gearing up for Acatenango", place: "Antigua, Guatemala", center: [-90.75, 14.58], date: "Aug 2026", width: 1200, height: 1600, video: false },
  { id: "lanquin-pool", caption: "Hostel pool table, Lanquín", place: "Lanquín, Guatemala", center: [-89.96, 15.58], date: "Aug 2026", width: 1600, height: 875, video: false },
  { id: "lanquin-cave", caption: "Candlelit cave", place: "Lanquín, Guatemala", center: [-89.97, 15.57], date: "Aug 2026", width: 1200, height: 1600, video: false },
  { id: "lanquin-cat", caption: "Hostel cat, Lanquín", place: "Lanquín, Guatemala", center: [-89.95, 15.54], date: "Aug 2026", width: 1200, height: 1600, video: false },
  { id: "lanquin-rainforest", caption: "Rainforest view", place: "Lanquín, Guatemala", center: [-89.94, 15.55], date: "Aug 2026", width: 1200, height: 1600, video: false },
  { id: "semuc-canopy", caption: "Jungle canopy", place: "Semuc Champey, Guatemala", center: [-89.96, 15.53], date: "Aug 2026", width: 1200, height: 1600, video: false },
  { id: "semuc-champey", caption: "Semuc Champey", place: "Semuc Champey, Guatemala", center: [-89.95, 15.53], date: "Aug 2026", width: 1200, height: 1600, video: false },
  { id: "austin-coffee", caption: "Best Coffee in Austin", place: "Austin, TX", center: [-97.74, 30.27], date: "", width: 1067, height: 1600, video: false },
  { id: "austin-friends", caption: "IBM Summer Interns", place: "Austin, TX", center: [-97.75, 30.28], date: "", width: 1440, height: 1080, video: false },
  { id: "austin-cat", caption: "Nala (Foster Cat)", place: "Austin, TX", center: [-97.74, 30.29], date: "Jun 2026", width: 1200, height: 1600, video: false },
  { id: "austin-mural", caption: "Music mural, Austin", place: "Austin, TX", center: [-97.73, 30.26], date: "Jul 2026", width: 1200, height: 1600, video: false },
  { id: "ut-gameday", caption: "UT vs Ohio State", place: "Austin, TX", center: [-97.73, 30.28], date: "2023", width: 1600, height: 1067, video: false },
  { id: "austin-cat-nap", caption: "Nala", place: "Austin, TX", center: [-97.75, 30.29], date: "Jun 2026", width: 1200, height: 1600, video: true },
  { id: "seattle-mountains", caption: "Mt. Rainier", place: "Seattle, WA", center: [-122.33, 47.61], date: "", width: 1600, height: 1063, video: false },
  { id: "seattle-vipers", caption: "Carshow in Seattle", place: "Seattle, WA", center: [-122.31, 47.62], date: "Jun 2026", width: 1600, height: 1200, video: true },
  { id: "seattle-viper-row", caption: "Carshow 2", place: "Seattle, WA", center: [-122.35, 47.6], date: "Jun 2026", width: 1200, height: 1600, video: false },
  { id: "seattle-lookout", caption: "Rainier Viewpoint", place: "Seattle, WA", center: [-122.32, 47.59], date: "Jun 2026", width: 1200, height: 1600, video: false },
  { id: "frisco-tennis", caption: "Tennis", place: "Frisco, TX", center: [-96.82, 33.15], date: "", width: 1170, height: 512, video: false },
  { id: "adobe-cohort", caption: "Adobe Express student cohort", place: "San Jose, CA", center: [-121.89, 37.33], date: "", width: 1600, height: 900, video: false },
  { id: "rio-havaianas", caption: "Havaianas wall", place: "Rio de Janeiro, Brazil", center: [-43.19, -22.97], date: "Mar 2026", width: 898, height: 1600, video: false },
  { id: "rio-pups", caption: "Sidewalk pups", place: "Rio de Janeiro, Brazil", center: [-43.18, -22.97], date: "Mar 2026", width: 1200, height: 1600, video: false },
  { id: "rio-christ", caption: "Christ the Redeemer", place: "Rio de Janeiro, Brazil", center: [-43.21, -22.95], date: "Mar 2026", width: 1200, height: 1600, video: false },
  { id: "rio-hang-gliding", caption: "Hang gliding over Rio (video)", place: "Rio de Janeiro, Brazil", center: [-43.28, -22.99], date: "Mar 2026", width: 1039, height: 1600, video: true },
  { id: "sao-paulo-skyline", caption: "São Paulo Skyline", place: "São Paulo, Brazil", center: [-46.66, -23.56], date: "Mar 2026", width: 1200, height: 1600, video: false },
  { id: "sao-paulo-books", caption: "São Paulo Bookstore", place: "São Paulo, Brazil", center: [-46.67, -23.56], date: "Mar 2026", width: 1200, height: 1600, video: false },
];

/** Paths are relative to the site root; prefix with the base path when rendering. */
export const photoSrc = (p: Photo, size: 'full' | 'thumb' = 'full') => `/media/photos/${p.id}${size === 'thumb' ? '-thumb' : ''}.jpg`;
export const videoSrc = (p: Photo) => `/media/photos/${p.id}.mp4`;
