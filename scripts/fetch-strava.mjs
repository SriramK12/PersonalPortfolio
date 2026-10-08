// Fetches recent public Strava activities into content/strava.json (git-ignored) at build time.
// Needs STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET and STRAVA_REFRESH_TOKEN (GitHub secrets in CI,
// .env.local locally; set them with `npm run strava:auth`). Without them, or on any error, it keeps
// the previous file if one exists and never fails the build; the site falls back to generated routes.
import { writeFile } from 'node:fs/promises';

const OUT = new URL('../content/strava.json', import.meta.url);
const TRIM_M = 400; // cut from both ends of every route, so tracks don't reveal start/finish points
const MAX = 24;
const { STRAVA_CLIENT_ID: id, STRAVA_CLIENT_SECRET: secret, STRAVA_REFRESH_TOKEN: refresh } = process.env;

const log = (msg) => console.log(`[strava] ${msg}`);

// Activity names never shown on the site: drinking, profanity, slang, and low-effort titles.
// Matched as whole words, case-insensitive. Such activities get a Strava-style default name instead.
const BLOCKED_WORDS = [
  'drink', 'drinks', 'drinking', 'drunk', 'beer', 'beers', 'booze', 'alcohol', 'tipsy', 'hungover', 'hangover', 'wasted', 'shots', 'party', 'partying',
  'damn', 'dammit', 'fuck', 'fucking', 'fucked', 'shit', 'shitty', 'bitch', 'ass', 'asshole', 'crap', 'hell', 'piss', 'pissed', 'dick', 'wtf', 'lmao', 'lmfao', 'bs',
  'weed', 'sex', 'sexy', 'freeball', 'freeballing', 'larp', 'jit', 'sum', 'blah', 'random',
];
const BLOCKED = new RegExp(`\\b(${BLOCKED_WORDS.join('|')})\\b`, 'i');
const isProfessional = (name) => !BLOCKED.test(name);

/** Strava's default naming: time of day from the local start time, plus the sport. */
function defaultName(a) {
  const hour = Number(a.start_date_local.slice(11, 13));
  const time = hour >= 4 && hour < 11 ? 'Morning' : hour < 14 && hour >= 11 ? 'Lunch' : hour >= 14 && hour < 17 ? 'Afternoon' : hour >= 17 && hour < 21 ? 'Evening' : 'Night';
  const type = a.sport_type || a.type || '';
  const sport = /Run/.test(type) ? 'Run' : /Hike/.test(type) ? 'Hike' : /Ride/.test(type) ? 'Ride' : /Walk/.test(type) ? 'Walk' : 'Activity';
  return `${time} ${sport}`;
}

/** Google encoded-polyline decoder; returns [lng, lat] pairs. */
function decode(str) {
  const out = [];
  let i = 0, lat = 0, lng = 0;
  while (i < str.length) {
    for (const axis of [0, 1]) {
      let shift = 0, result = 0, b;
      do {
        b = str.charCodeAt(i++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const delta = result & 1 ? ~(result >> 1) : result >> 1;
      if (axis === 0) lat += delta;
      else lng += delta;
    }
    out.push([+(lng / 1e5).toFixed(5), +(lat / 1e5).toFixed(5)]);
  }
  return out;
}

const rad = (d) => (d * Math.PI) / 180;
function dist(a, b) {
  const h = Math.sin(rad(b[1] - a[1]) / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(rad(b[0] - a[0]) / 2) ** 2;
  return 2 * 6371008.8 * Math.asin(Math.sqrt(h));
}

/** Drop TRIM_M meters from each end; returns null if too little route is left. */
function trim(coords) {
  const cut = (line) => {
    let d = 0;
    for (let i = 1; i < line.length; i++) {
      d += dist(line[i - 1], line[i]);
      if (d >= TRIM_M) return line.slice(i);
    }
    return [];
  };
  const out = cut(cut(coords).reverse()).reverse();
  return out.length >= 10 ? out : null;
}

async function main() {
  if (!id || !secret || !refresh) return log('no credentials; skipping (run `npm run strava:auth` to connect)');

  const tokenRes = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ client_id: id, client_secret: secret, refresh_token: refresh, grant_type: 'refresh_token' }),
  });
  const token = await tokenRes.json();
  if (!tokenRes.ok) throw new Error(`token refresh failed (HTTP ${tokenRes.status})`);
  if (token.refresh_token !== refresh) log('warning: Strava issued a new refresh token; rerun `npm run strava:auth` if fetching starts failing');

  const res = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=60', {
    headers: { authorization: `Bearer ${token.access_token}` },
  });
  if (!res.ok) throw new Error(`activities request failed (HTTP ${res.status})`);
  const list = await res.json();

  const activities = [];
  let renamed = 0;
  for (const a of list) {
    if (a.private || a.visibility !== 'everyone' || a.manual || !a.map?.summary_polyline) continue;
    const clean = isProfessional(a.name);
    if (!clean) renamed++;
    const coords = trim(decode(a.map.summary_polyline));
    if (!coords) continue;
    activities.push({
      id: String(a.id),
      name: clean ? a.name : defaultName(a),
      sport: a.sport_type || a.type,
      date: a.start_date_local.slice(0, 10),
      distance: Math.round(a.distance),
      movingTime: a.moving_time,
      coords,
    });
    if (activities.length >= MAX) break;
  }

  await writeFile(OUT, JSON.stringify(activities));
  log(`wrote ${activities.length} public activities (of ${list.length} fetched; ${renamed} renamed by the name filter)`);
}

main().catch((err) => log(`skipped: ${err.message}`));
