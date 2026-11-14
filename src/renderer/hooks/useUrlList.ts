import { useState } from 'react';
import { isValidUrl } from '../lib/validation';
import { playError, playSuccess } from '../lib/sounds';
import type { InputAnim, UrlEntry } from '../types';

/**
 * The URL list plus the input row that adds to it (quantity, alias, URL),
 * the invalid-URL error, and the add/error animations.
 */
export default function useUrlList() {
  // The list: each entry holds the url, qty and alias it was added with.
  const [urls, setUrls] = useState<UrlEntry[]>([]);
  const [urlInput, setUrlInput] = useState('');
  // Optional alias typed next to the URL input.
  const [aliasInput, setAliasInput] = useState('');
  // Selected qty from the qty dropdown; '' = none selected yet.
  const [qty, setQty] = useState('');
  // Message shown under the input row when an Add is rejected; '' = no error.
  const [urlError, setUrlError] = useState('');
  // True when the error is a missing quantity, so the qty dropdown shows the
  // error state instead of the URL input.
  const [qtyError, setQtyError] = useState(false);
  // Which one-shot animation the input is playing right now (see UrlForm.css).
  // Cleared in the input's onAnimationEnd so the next add/error can replay it.
  const [inputAnim, setInputAnim] = useState<InputAnim>('');
  // Bumped on each successful add; used as the List badge's key so React
  // re-creates it and its "pop" animation plays again.
  const [addCount, setAddCount] = useState(0);

  // Typing in the URL input clears a URL error. A missing-quantity error
  // stays until a quantity is chosen.
  const changeUrlInput = (value: string) => {
    setUrlInput(value);
    if (urlError && !qtyError) setUrlError('');
  };

  // Choosing a quantity clears a missing-quantity error.
  const changeQty = (value: string) => {
    setQty(value);
    if (qtyError) {
      setQtyError(false);
      setUrlError('');
    }
  };

  // Adds an entry { url, qty, alias } from the input row, then clears
  // the URL and alias inputs (the qty stays selected for the next one).
  // Blank entries are ignored, invalid URLs and a missing quantity show an
  // error, and URLs already in the list aren't added twice.
  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!isValidUrl(url)) {
      setUrlError("That doesn't look like a Sam's Club product URL.");
      setQtyError(false);
      setInputAnim('shake');
      playError();
      return;
    }
    // The generated script needs a number for every item, so a quantity is
    // required. The URL stays in the input so it doesn't need re-pasting.
    if (!qty) {
      setUrlError('Choose a quantity for this item first.');
      setQtyError(true);
      setInputAnim('shake');
      playError();
      return;
    }
    setUrlError('');
    setQtyError(false);
    setUrlInput('');
    const alias = aliasInput.trim();
    setAliasInput('');
    // Already in the list: nothing to celebrate.
    if (urls.some((entry) => entry.url === url)) return;
    setUrls((prev) => [...prev, { url, qty, alias }]);
    setInputAnim('success');
    setAddCount((n) => n + 1);
    playSuccess();
  };

  // Removes one entry (by its url) from the list.
  const removeUrl = (url: string) => {
    setUrls((prev) => prev.filter((entry) => entry.url !== url));
  };

  // True when the inputs differ from how the app first opens.
  const isDirty =
    urls.length > 0 ||
    urlInput !== '' ||
    aliasInput !== '' ||
    qty !== '' ||
    urlError !== '';

  return {
    urls,
    urlInput,
    changeUrlInput,
    aliasInput,
    setAliasInput,
    qty,
    setQty: changeQty,
    urlError,
    qtyError,
    inputAnim,
    clearInputAnim: () => setInputAnim(''),
    addCount,
    addUrl,
    removeUrl,
    isDirty,
  };
}
