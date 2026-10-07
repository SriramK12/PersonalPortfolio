// One-time Strava connection. Run with `npm run strava:auth`.
//
// 1. Asks for the Strava app's Client ID and Client Secret (the secret is typed hidden).
// 2. Opens Strava's approval page; Strava redirects back to http://localhost:8723.
// 3. Exchanges the code for a refresh token and stores all three values:
//    - as GitHub Actions secrets (via the gh CLI), for the daily site build
//    - in .env.local (git-ignored), for local builds
// Nothing sensitive is printed.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { homedir } from 'node:os';
import { createInterface } from 'node:readline';

const PORT = 8723;
const REDIRECT = `http://localhost:${PORT}/callback`;
const SCOPE = 'activity:read'; // public and followers-only activities, privacy zones excluded
const ENV_FILE = new URL('../.env.local', import.meta.url);

function ask(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/** Reads a line with no echo at all (readline would redraw pasted text on screen). */
function askHidden(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const { stdin } = process;
    let value = '';
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off('data', onData);
          process.stdout.write('\n');
          // Drop bracketed-paste markers some terminals wrap pasted text in.
          return resolve(value.replace(/\x1b\[20[01]~/g, '').trim());
        }
        if (ch === '\u0003') process.exit(130); // Ctrl-C
        if (ch === '\u007f') value = value.slice(0, -1); // Backspace
        else value += ch;
      }
    };
    stdin.on('data', onData);
  });
}

function findGh() {
  for (const bin of ['gh', `${homedir()}/.local/bin/gh`, '/opt/homebrew/bin/gh', '/usr/local/bin/gh']) {
    if (spawnSync(bin, ['--version']).status === 0) return bin;
  }
  return null;
}

function setSecret(gh, name, value) {
  const r = spawnSync(gh, ['secret', 'set', name, '--repo', 'SriramK12/PersonalPortfolio'], { input: value });
  if (r.status !== 0) throw new Error(`gh secret set ${name} failed: ${r.stderr}`);
}

function waitForCode() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, REDIRECT);
      if (url.pathname !== '/callback') return res.writeHead(404).end();
      const code = url.searchParams.get('code');
      const scope = url.searchParams.get('scope') || '';
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(code ? '<h1>Connected. You can close this tab.</h1>' : '<h1>Not connected.</h1><p>Approval was cancelled.</p>');
      server.close();
      if (!code) return reject(new Error('Approval was cancelled.'));
      if (!scope.includes('activity:read')) return reject(new Error('Activity access was not granted. Rerun and keep "View data about your activities" checked.'));
      resolve(code);
    });
    server.listen(PORT, '127.0.0.1');
  });
}

const gh = findGh();
if (!gh) {
  console.error('The GitHub CLI (gh) was not found. Install it, then rerun.');
  process.exit(1);
}

const clientId = await ask('Strava Client ID: ');
const clientSecret = await askHidden('Strava Client Secret (hidden): ');
if (!/^\d+$/.test(clientId) || !clientSecret) {
  console.error('Client ID must be a number and the secret cannot be empty.');
  process.exit(1);
}

const authorize = new URL('https://www.strava.com/oauth/authorize');
authorize.search = new URLSearchParams({ client_id: clientId, redirect_uri: REDIRECT, response_type: 'code', approval_prompt: 'force', scope: SCOPE }).toString();
console.log('\nOpening Strava in your browser. Click "Authorize" there.');
console.log(`If it does not open, visit:\n${authorize}\n`);
spawn('open', [authorize.toString()], { stdio: 'ignore', detached: true }).unref();

const code = await waitForCode();
const res = await fetch('https://www.strava.com/oauth/token', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, grant_type: 'authorization_code' }),
});
const token = await res.json();
if (!res.ok || !token.refresh_token) {
  console.error(`Strava rejected the code (HTTP ${res.status}). Check the Client Secret and rerun.`);
  process.exit(1);
}

setSecret(gh, 'STRAVA_CLIENT_ID', clientId);
setSecret(gh, 'STRAVA_CLIENT_SECRET', clientSecret);
setSecret(gh, 'STRAVA_REFRESH_TOKEN', token.refresh_token);

// Keep any unrelated lines already in .env.local.
const kept = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8').split('\n').filter((l) => l && !l.startsWith('STRAVA_')) : [];
writeFileSync(ENV_FILE, [...kept, `STRAVA_CLIENT_ID=${clientId}`, `STRAVA_CLIENT_SECRET=${clientSecret}`, `STRAVA_REFRESH_TOKEN=${token.refresh_token}`, ''].join('\n'), { mode: 0o600 });

console.log(`Connected as ${token.athlete?.firstname ?? 'your account'}.`);
console.log('Saved STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET and STRAVA_REFRESH_TOKEN as GitHub secrets and in .env.local.');
