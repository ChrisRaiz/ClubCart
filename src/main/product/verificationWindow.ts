import { BrowserWindow } from 'electron';
import { PARTITION } from './constants';
import parseProduct from './parse';
import type { Product } from './types';

/** Opens a visible window so the user can complete the bot check, then reads the product. */
export default function getProductViaWindow(
  url: string,
  qty: string,
  alias?: string,
  parent?: BrowserWindow,
) {
  return new Promise<Product>((resolve, reject) => {
    // Visible window on the shared session, so the cookies the site sets after
    // the user passes the check are saved for later plain requests.
    const win = new BrowserWindow({
      width: 1000,
      height: 800,
      parent,
      title: 'Verify you are human to continue',
      webPreferences: { partition: PARTITION },
    });

    // Set once a product has been read, so the timer and the 'closed'
    // handler know the work is finished.
    let done = false;

    // Once a second, read the window's current HTML and try to parse a product.
    const timer = setInterval(async () => {
      if (done || win.isDestroyed()) return;
      try {
        const html: string = await win.webContents.executeJavaScript(
          'document.documentElement.outerHTML',
        );
        const product = parseProduct(html, qty, alias || '');
        if (product) {
          // Product found: stop polling, close the window, return the result.
          done = true;
          clearInterval(timer);
          win.close();
          resolve(product);
        }
      } catch {
        // Page is mid-navigation; try again on the next tick.
      }
    }, 1000);

    // If the user closes the window before a product is read, fail the request.
    win.on('closed', () => {
      clearInterval(timer);
      if (!done) reject(new Error('Verification window was closed'));
    });

    win.loadURL(url);
  });
}
