/** A product as returned by the main process's `get-product` handler. */
export type Product = Awaited<ReturnType<typeof window.electron.getProduct>>;

/** One item in the list: the input row's values when it was added. */
export type UrlEntry = {
  url: string;
  qty: string; // '' if no qty was selected
  alias: string; // '' if none was typed
};

/** Progress of a product-loading run. */
export type Progress = {
  done: number;
  total: number;
};

/** One-shot animation the URL input is playing ('' = none). */
export type InputAnim = '' | 'success' | 'shake';
