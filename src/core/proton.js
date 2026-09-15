'use strict';
// Runs Windows-only helper programs (currently ReShade Setup) in the exact
// Steam Play prefix used by a game.  Copying DLLs itself is ordinary Linux IO;
// only the setup executable needs Proton.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

function protonCandidates(steamRoot, prefix, home = os.homedir()) {
  // A Bazzite install often uses Proton-GE, Proton-Cachy or Proton-EM rather
  // than a Valve build. Those tools live in compatibilitytools.d, not in
  // steamapps/common, so considering only the latter made a valid Steam Play
  // prefix look unsupported.
  const common = path.join(steamRoot, 'steamapps', 'common');
  const dataHome = process.env.XDG_DATA_HOME || path.join(home, '.local', 'share');
  const toolRoots = [...new Set([
    common,
    path.join(steamRoot, 'compatibilitytools.d'),
    path.join(dataHome, 'Steam', 'compatibilitytools.d'),
    path.join(home, '.steam', 'steam', 'compatibilitytools.d'),
    path.join(home, '.var', 'app', 'com.valvesoftware.Steam', 'data', 'Steam', 'compatibilitytools.d')
  ])];
  const candidates = [];
  for (const root of toolRoots) {
    let names = [];
    try { names = fs.readdirSync(root); } catch { continue; }
    for (const name of names) {
      // Built-in tools are in steamapps/common; custom tools deliberately do
      // not share a stable name, so accept every compatibility-tools proton.
      if (root === common && !/^Proton(?:\s|\d|[-_])/i.test(name)) continue;
      const file = path.join(root, name, 'proton');
      if (fs.existsSync(file)) candidates.push({ name, file });
    }
  }
  let configured = '';
  try { configured = fs.readFileSync(path.join(path.dirname(prefix), 'config_info'), 'utf8').trim(); } catch {}
  return candidates
    .sort((a, b) => Number(b.name === configured || configured.includes(b.name)) - Number(a.name === configured || configured.includes(a.name)))
    .map(({ file }) => file);
}

function contextForSteamGame(game) {
  if (process.platform !== 'linux' || !game || !game.steamRoot || !game.protonPrefix) return null;
  if (!fs.existsSync(game.protonPrefix)) return null;
  const proton = protonCandidates(game.steamRoot, game.protonPrefix)[0];
  return proton ? { proton, prefix: game.protonPrefix, steamRoot: game.steamRoot, appid: game.id } : null;
}

function createSetupRunner(context) {
  return (setupExe, args, log) => new Promise((resolve) => {
    log('runningSetup', { setup: path.basename(setupExe), args: args.slice(1).join(' ') });
    const child = spawn(context.proton, ['run', setupExe, ...args], {
      cwd: path.dirname(args[0]),
      env: {
        ...process.env,
        WINEPREFIX: context.prefix,
        STEAM_COMPAT_DATA_PATH: path.dirname(context.prefix),
        STEAM_COMPAT_CLIENT_INSTALL_PATH: context.steamRoot,
        STEAM_COMPAT_APP_ID: context.appid
      }
    });
    let output = '';
    child.stdout.on('data', (data) => { output += data.toString(); });
    child.stderr.on('data', (data) => { output += data.toString(); });
    child.on('error', (error) => resolve({ code: -1, output: error.message }));
    child.on('close', (code) => resolve({ code, output: output.trim() }));
    setTimeout(() => { try { child.kill(); } catch {} }, 120000);
  });
}

module.exports = { protonCandidates, contextForSteamGame, createSetupRunner };
