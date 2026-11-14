import { BrowserWindow, session } from 'electron';
import { PARTITION } from './constants';
import parseProduct from './parse';
import getProductViaWindow from './verificationWindow';
import type { Product } from './types';

export type { Product } from './types';
export { default as parseProduct } from './parse';

/**
 * Gets a product's name, SKU and offerId from a Sam's Club product page URL.
 * Tries a plain request first, and opens a verification window only if the
 * request was redirected to the bot check.
 */
export async function getProduct(
  url: string,
  qty: string,
  alias: string,
  parent?: BrowserWindow,
): Promise<Product | null> {
  console.log('url:', url);
  // Only allow https URLs on samsclub.com or one of its subdomains.
  const { protocol, hostname } = new URL(url);
  if (
    protocol !== 'https:' ||
    !(hostname === 'samsclub.com' || hostname.endsWith('.samsclub.com'))
  ) {
    throw new Error('Not a Sam’s Club URL');
  }

  // Plain request on the shared session. The body can only be read once,
  // so it's read into `html` here.
  const response = await session.fromPartition(PARTITION).fetch(url);
  const html = await response.text();

  // response.url is the final URL after redirects. If it's the bot check
  // page, let the user complete it in a window.
  if (response.url.includes('are-you-human'))
    return getProductViaWindow(url, qty, alias, parent);

  // Not redirected: read the product straight from the response.
  return parseProduct(html, qty, alias);
}
