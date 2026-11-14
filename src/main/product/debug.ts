import fs from 'fs';
import path from 'path';
import { app } from 'electron';

// ─── Debug: save the HTML parseProduct sees ───────────────────────
// In development this is <project>/debug (git-ignored); in a packaged app
// it's the app's user-data folder, since the app folder is read-only there.
const DEBUG_DIR = app.isPackaged
  ? path.join(app.getPath('userData'), 'debug')
  : path.join(app.getAppPath(), 'debug');

let debugPathLogged = false;

/** Writes a file into DEBUG_DIR, replacing the previous run's copy. */
export default function writeDebugFile(name: string, contents: string) {
  const file = path.join(DEBUG_DIR, name);
  fs.promises
    .mkdir(DEBUG_DIR, { recursive: true })
    .then(() => fs.promises.writeFile(file, contents, 'utf8'))
    .then(() => {
      if (!debugPathLogged) {
        debugPathLogged = true;
        console.log('parseProduct debug files:', DEBUG_DIR);
      }
      return undefined;
    })
    .catch((error) => console.error('Could not write debug file', file, error));
}
