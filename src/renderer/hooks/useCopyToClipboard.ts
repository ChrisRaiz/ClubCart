import { useCallback, useEffect, useRef, useState } from 'react';
import { playError, playSuccess } from '../lib/sounds';

export type CopyState = 'idle' | 'copied' | 'failed';

/**
 * Copies text to the clipboard. `copyState` is 'copied' or 'failed' for a
 * moment after each copy (for button feedback), then goes back to 'idle'.
 */
export default function useCopyToClipboard(resetAfterMs = 1600) {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Don't leave a pending reset running after unmount (e.g. on Reset).
  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopyState('copied');
        playSuccess();
      } catch (error) {
        console.error('Could not copy to the clipboard:', error);
        setCopyState('failed');
        playError();
      }
      // Reset after a moment; restart the timer on repeat clicks.
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopyState('idle'), resetAfterMs);
    },
    [resetAfterMs],
  );

  return { copyState, copy };
}
