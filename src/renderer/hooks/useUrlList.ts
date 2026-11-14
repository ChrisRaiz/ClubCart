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
  // Message shown under the input when an invalid URL is submitted; '' = no error.
  const [urlError, setUrlError] = useState('');
  // Which one-shot animation the input is playing right now (see UrlForm.css).
  // Cleared in the input's onAnimationEnd so the next add/error can replay it.
  const [inputAnim, setInputAnim] = useState<InputAnim>('');
  // Bumped on each successful add; used as the List badge's key so React
  // re-creates it and its "pop" animation plays again.
  const [addCount, setAddCount] = useState(0);

  // Typing in the URL input clears any error.
  const changeUrlInput = (value: string) => {
    setUrlInput(value);
    if (urlError) setUrlError('');
  };

  // Adds an entry { url, qty, alias } from the input row, then clears
  // the URL and alias inputs (the qty stays selected for the next one).
  // Blank entries are ignored, invalid URLs show an error, and URLs already
  // in the list aren't added twice.
  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!isValidUrl(url)) {
      setUrlError("That doesn't look like a Sam's Club product URL.");
      setInputAnim('shake');
      playError();
      return;
    }
    setUrlError('');
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
    setQty,
    urlError,
    inputAnim,
    clearInputAnim: () => setInputAnim(''),
    addCount,
    addUrl,
    removeUrl,
    isDirty,
  };
}
