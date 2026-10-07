// Generates content/routes.json: street-snapped walking routes for every section.
// Run once with `npm run routes`; the site only reads the committed JSON.
// Waypoints are [lng, lat]. Routing: OSRM foot profile hosted by FOSSGIS (routing.openstreetmap.de).
import { writeFile } from 'node:fs/promises';

const P = {
  tower: [-97.7394, 30.2862],
  mccombs: [-97.7377, 30.2840],
  speedway: [-97.7366, 30.2890],
  gregory: [-97.7366, 30.2842],
  capitol: [-97.7404, 30.2747],
  congressN: [-97.7449, 30.2620],
  congressS: [-97.7462, 30.2580],
  soco: [-97.7497, 30.2490],
  pfluger: [-97.7516, 30.2641],
  zilker: [-97.7729, 30.2669],
  barton: [-97.7713, 30.2640],
  mopacN: [-97.7700, 30.2735],
  shoal: [-97.7500, 30.2780],
  pease: [-97.7531, 30.2856],
  rainey: [-97.7383, 30.2585],
  east6: [-97.7240, 30.2640],
  festival: [-97.7330, 30.2510],
  spyglass: [-97.7900, 30.2550],
  gusFruh: [-97.7830, 30.2490],
  bonnell: [-97.7733, 30.3211],
  laguna: [-97.7720, 30.3141],
  hydePark: [-97.7290, 30.3060],
  penick: [-97.7310, 30.2835],
  ibm: [-97.7175, 30.4040],
  domain: [-97.7253, 30.4021],
  woodMarket: [-95.4625, 30.1605],
  woodWaterway: [-95.4587, 30.1611],
  woodHughes: [-95.4720, 30.1730],
  sjPark: [-121.8935, 37.3307],
  sjRiver: [-121.8990, 37.3330],
  sjPedro: [-121.8941, 37.3366],
  sjCesar: [-121.8897, 37.3318],
};

// Each section/item gets a route. Closed loops repeat the first waypoint.
const ROUTES = {
  intro: [P.tower, P.capitol, P.congressN, P.pfluger, P.zilker, P.mopacN, P.shoal, P.pease, P.tower],
  dashboard: [P.tower, P.capitol, P.congressN, P.congressS, P.pfluger, P.shoal, P.tower],
  activities: [P.mccombs, P.capitol, P.rainey, P.festival, P.congressS, P.congressN, P.mccombs],
  studysense: [P.tower, P.speedway, P.hydePark, P.penick, P.tower],
  plateconnect: [P.capitol, P.east6, P.rainey, P.congressN, P.capitol],
  'credit-card-advisor': [P.mccombs, P.shoal, P.pease, P.tower, P.mccombs],
  segments: [P.tower, P.gregory, P.mccombs, P.capitol, P.tower],
  'seg-ibm': [P.ibm, P.domain, P.ibm],
  'seg-avion': [P.woodMarket, P.woodWaterway, P.woodHughes, P.woodMarket],
  'seg-drink-barcode': [P.congressS, P.soco, P.congressS],
  'seg-adobe': [P.sjPark, P.sjRiver, P.sjPedro, P.sjCesar, P.sjPark],
  'seg-convergent': [P.mccombs, P.speedway, P.gregory, P.mccombs],
  'seg-texas-consulting': [P.tower, P.capitol, P.mccombs, P.tower],
  routes: [P.zilker, P.barton, P.spyglass, P.gusFruh, P.zilker],
  hiking: [P.spyglass, P.gusFruh, P.barton, P.spyglass],
  photography: [P.capitol, P.congressN, P.rainey, P.east6, P.capitol],
  food: [P.congressS, P.soco, P.festival, P.rainey, P.congressS],
  tennis: [P.penick, P.gregory, P.speedway, P.penick],
  profile: [P.tower, P.pease, P.laguna, P.bonnell, P.laguna, P.shoal, P.tower],
  follow: [P.mccombs, P.capitol, P.congressN, P.pfluger],
};

// Travel is a flight path, not a street route: great-circle-ish arcs between cities.
function arc(a, b, steps = 64) {
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lng = a[0] + (b[0] - a[0]) * t;
    const lat = a[1] + (b[1] - a[1]) * t + Math.sin(Math.PI * t) * Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.18;
    out.push([+lng.toFixed(5), +lat.toFixed(5)]);
  }
  return out;
}

async function route(waypoints) {
  const coords = waypoints.map((p) => p.join(',')).join(';');
  const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.code !== 'Ok') throw new Error(`${json.code}: ${url}`);
  // 5 decimals is ~1m precision; drop consecutive duplicates.
  const line = json.routes[0].geometry.coordinates.map(([x, y]) => [+x.toFixed(5), +y.toFixed(5)]);
  return line.filter((p, i) => i === 0 || p[0] !== line[i - 1][0] || p[1] !== line[i - 1][1]);
}

const out = {};
for (const [id, waypoints] of Object.entries(ROUTES)) {
  out[id] = await route(waypoints);
  console.log(id.padEnd(22), out[id].length, 'points');
  await new Promise((r) => setTimeout(r, 400)); // be polite to the shared server
}
out.travel = [...arc(P.tower, P.woodMarket), ...arc(P.woodMarket, P.sjPark).slice(1)];

await writeFile(new URL('../content/routes.json', import.meta.url), JSON.stringify(out));
console.log('wrote content/routes.json');
