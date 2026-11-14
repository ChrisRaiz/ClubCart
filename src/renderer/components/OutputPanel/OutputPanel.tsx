import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import { CheckIcon, CopyIcon } from '../icons';
import './OutputPanel.css';

type OutputPanelProps = {
  value: string; // '' shows the placeholder
  busy: boolean; // shows the "thinking" overlay and hides Copy
};

/** Read-only output box with a Copy button and a loading overlay. */
export default function OutputPanel({ value, busy }: OutputPanelProps) {
  const { copyState, copy } = useCopyToClipboard();

  return (
    <div className="outputWrap">
      {/* readOnly: text can be selected and copied, but not changed. */}
      <textarea
        className="output"
        value={value}
        placeholder="Generated script will appear here!"
        readOnly
        spellCheck={false}
      />

      {/* Copies everything in the box. Hidden while the "thinking" overlay
          is showing, since there's nothing final to copy yet. */}
      {!busy && (
        <button
          type="button"
          className={`copyButton${copyState !== 'idle' ? ` copy-${copyState}` : ''}`}
          onClick={() => copy(value)}
          aria-label="Copy all text to clipboard"
          title="Copy to clipboard"
        >
          {copyState === 'copied' ? <CheckIcon /> : <CopyIcon />}
          <span>
            {copyState === 'copied' && 'Copied'}
            {copyState === 'failed' && 'Failed'}
            {copyState === 'idle' && 'Copy'}
          </span>
        </button>
      )}

      {/* Announces the copy result to screen readers. */}
      <span className="visuallyHidden" role="status">
        {copyState === 'copied' && 'Copied to clipboard'}
        {copyState === 'failed' && 'Could not copy to clipboard'}
      </span>

      {/* While loading: a "typing" overlay on top of the box. Decorative
          only; the run status line announces progress. */}
      {busy && (
        <div className="outputThinking" aria-hidden="true">
          <span className="thinkingPrompt">&gt;</span>
          <span className="thinkingTyping">Generating Script</span>
          <span className="thinkingDots">
            <i />
            <i />
            <i />
          </span>
        </div>
      )}
    </div>
  );
}
