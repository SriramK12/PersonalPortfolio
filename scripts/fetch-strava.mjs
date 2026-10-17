// Fetches recent public Strava activities into content/strava.json (git-ignored) at build time.
// Needs STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET and STRAVA_REFRESH_TOKEN (GitHub secrets in CI,
// .env.local locally; set them with `npm run strava:auth`). Without them, or on any error, it keeps
// the previous file if one exists and never fails the build; the site falls back to generated routes.
import { readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';

const OUT = new URL('../content/strava.json', import.meta.url);
const TRIM_M = 400; // cut from both ends of every route, so tracks don't reveal start/finish points
const MAX = 24;
const { STRAVA_CLIENT_ID: id, STRAVA_CLIENT_SECRET: secret, STRAVA_REFRESH_TOKEN: refresh } = process.env;

const log = (msg) => console.log(`[strava] ${msg}`);

// Activity names never shown on the site: drinking, profanity, slang, and low-effort titles.
// Such activities get a Strava-style default name instead (see defaultName).
// Profanity matches anywhere in a word ("fuckass"); everything else matches whole words only,
// so "Summer run" or "Brooklyn loop" are left alone.
const PROFANITY = ['fuck', 'shit', 'bitch', 'damn', 'dammit', 'cunt', 'bastard', 'asshole', 'dumbass', 'badass', 'piss', 'wtf', 'lmao', 'lmfao'];
const BLOCKED_WORDS = [
  'drink', 'drinks', 'drinking', 'drunk', 'beer', 'beers', 'booze', 'alcohol', 'tipsy', 'hungover', 'hangover', 'wasted', 'shots', 'party', 'partying',
  'ass', 'crap', 'hell', 'dick', 'bs', 'weed', 'sex', 'sexy',
  'freeball', 'freeballing', 'larp', 'jit', 'lil', 'bro', 'bros', 'bruh', 'dawg', 'ngl', 'lowkey', 'fr', 'ong', 'sus', 'sum',
  'blah', 'random',
];
const BLOCKED = new RegExp(`(${PROFANITY.join('|')})|\\b(${BLOCKED_WORDS.join('|')})\\b`, 'i');
const isProfessional = (name) => !BLOCKED.test(name);

// Real English words containing a double letter (from the macOS /usr/share/dict word list), used to
// tell "goooood" (good) from "zoneeee" (zone) when undoing stretched letters.
const DOUBLED = new Set(readFileSync(new URL('./data/doubled-words.txt', import.meta.url), 'utf8').split('\n'));
// A word counts if it or its stem is a real word, or if it's a compound that starts with one: a
// 4+ letter word covering the doubled letters, followed by 3+ more letters ("cool" + "down").
function isDoubledWord(w) {
  if ([w, w.replace(/(es|s|ed|ing)$/, '')].some((x) => DOUBLED.has(x))) return true;
  const end = w.search(/(.)\1/) + 2;
  for (let i = Math.max(end, 4); i <= w.length - 3; i++) if (DOUBLED.has(w.slice(0, i))) return true;
  return false;
}

/** Undo letters stretched for emphasis: "Zoneeeee 2" → "Zone 2", "Goooood run" → "Good run". */
function unstretch(name) {
  return name.replace(/[A-Za-z]+/g, (word) => {
    if (!/([a-z])\1\1/i.test(word)) return word;
    const double = word.replace(/([a-z])\1{2,}/gi, '$1$1');
    return isDoubledWord(double.toLowerCase()) ? double : word.replace(/([a-z])\1{2,}/gi, '$1');
  });
}

/** Name from the local start time and sport: Morning (4am–noon), Afternoon (noon–3pm), Evening
 * (3–8pm) or Night (8pm–4am). Activities over 4 miles lead with their distance rounded down, e.g. a 5.32-mile run
 * at 10pm becomes "5-mile Night Run". */
function defaultName(a) {
  const hour = Number(a.start_date_local.slice(11, 13));
  const time = hour >= 4 && hour < 12 ? 'Morning' : hour >= 12 && hour < 15 ? 'Afternoon' : hour >= 15 && hour < 20 ? 'Evening' : 'Night';
  const type = a.sport_type || a.type || '';
  const sport = /Run/.test(type) ? 'Run' : /Hike/.test(type) ? 'Hike' : /Ride/.test(type) ? 'Ride' : /Walk/.test(type) ? 'Walk' : 'Activity';
  const miles = a.distance / 1609.344;
  return miles > 4 ? `${Math.floor(miles)}-mile ${time} ${sport}` : `${time} ${sport}`;
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

  const usable = list.filter((a) => !a.private && a.visibility === 'everyone' && !a.manual && a.map?.summary_polyline);

  const activities = [];
  let renamed = 0;
  let unstretched = 0;
  for (const a of usable) {
    const coords = trim(decode(a.map.summary_polyline));
    if (!coords) continue;
    // Runs are always named by time of day, whatever they're called on Strava. Other activities
    // keep their names, cleaned up: stretched letters undone, unprofessional names replaced.
    const isRun = /Run/.test(a.sport_type || a.type || '');
    const name = unstretch(a.name);
    if (!isRun && name !== a.name) unstretched++;
    const clean = !isRun && isProfessional(name);
    if (!isRun && !clean) renamed++;
    activities.push({
      id: String(a.id),
      name: clean ? name : defaultName(a),
      sport: a.sport_type || a.type,
      date: a.start_date_local.slice(0, 10),
      distance: Math.round(a.distance),
      movingTime: a.moving_time,
      coords,
    });
    if (activities.length >= MAX) break;
  }

  await writeFile(OUT, JSON.stringify(activities));
  log(`wrote ${activities.length} public activities (of ${list.length} fetched; runs named by time of day; ${renamed} other names replaced by the filter; ${unstretched} with stretched letters fixed)`);
}

main().catch((err) => log(`skipped: ${err.message}`));
