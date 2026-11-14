import { BrowserWindow, ipcMain } from 'electron';
import { getProduct } from './product';

/**
 * Registers every IPC handler the renderer talks to (see preload.ts).
 * `getMainWindow` is called at request time, so it always returns the
 * current window (it's recreated on macOS when the dock icon is clicked).
 */
export default function registerIpcHandlers(
  getMainWindow: () => BrowserWindow | null,
) {
  // Network requests made from the main process are not subject to CORS.
  ipcMain.handle(
    'get-product',
    (_event, url: string, qty: string, alias: string) =>
      getProduct(url, qty, alias, getMainWindow() ?? undefined),
  );
}
