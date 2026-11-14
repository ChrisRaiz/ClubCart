import writeDebugFile from './debug';
import type { Product } from './types';

/**
 * Extracts the product name, SKU and offerId from a product page's HTML.
 * The values are read from the page's schema.org product data block.
 */
export default function parseProduct(
  html: string,
  qty: string,
  alias: string,
): Product | null {
  // Debug: the full page exactly as received.
  writeDebugFile('parse-product-full.html', html);

  // Keep only the text after the schema.org product block's marker, so the
  // searches below don't match "name"/"sku"/"offerId" elsewhere on the page.
  html = html.split('data-seo-id="schema-org-product"')[1];

  // Debug: the part after the marker that the searches below run on.
  writeDebugFile(
    'parse-product-section.txt',
    html ?? '(marker data-seo-id="schema-org-product" not found on this page)',
  );
  // Start/end positions of each value. Each start offset is the length of the
  // key (e.g. '"name":' is 7 characters) plus 1 to skip the value's opening
  // quote. Each end is the comma after the value, minus 1 to drop its closing quote.
  const idx = {
    name: {
      start: html.indexOf('"name":') + 8,
      end: html.indexOf('"', html.indexOf('"name":') + 8),
    },
    sku: {
      start: html.indexOf('"sku":') + 7,
      end: html.indexOf('"', html.indexOf('"sku":') + 7),
    },
    offerId: {
      start: html.lastIndexOf('"offerId":') + 11,
      end: html.indexOf('"', html.lastIndexOf('"offerId":') + 11),
    },
  };

  // Cut each value out of the HTML, falling back to '' if nothing was found.
  const product = {
    name: html.slice(idx.name.start, idx.name.end) || '',
    sku: html.slice(idx.sku.start, idx.sku.end) || '',
    offerId: html.slice(idx.offerId.start, idx.offerId.end) || '',
    qty: qty || '1',
    alias: alias || '',
  };

  console.table(product);
  if (!product.name || !product.sku || !product.offerId) return null;

  return product;
}
