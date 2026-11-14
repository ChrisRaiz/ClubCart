import type { Product, UrlEntry } from '../types';

// Loads each URL one at a time (so at most one verification window is open).
// A URL that fails is logged and skipped; the rest of the batch still loads.
// onProgress(done, total) is called after each URL finishes (loaded or skipped),
// so the UI can show how far along the batch is.
export async function getProducts(
  urls: UrlEntry[],
  onProgress?: (done: number, total: number) => void,
) {
  if (!urls || urls.length < 1) return;

  const products: Product[] = [];

  for (const [i, url] of urls.entries()) {
    try {
      const product = await window.electron.getProduct(
        url.url,
        url.qty,
        url.alias,
      );
      // The main process returns null when the page has no product data.
      if (product) {
        products.push(product);
      } else {
        console.warn('No product data found, skipping:', url);
      }
    } catch (error: unknown) {
      console.error(
        'Failed to load product, skipping:',
        url,
        error instanceof Error ? error.message : error,
      );
    }
    onProgress?.(i + 1, urls.length);
  }

  return products;
}

export default getProducts;
