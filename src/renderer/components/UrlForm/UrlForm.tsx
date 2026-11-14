import { QUANTITIES } from '../../constants';
import type { InputAnim } from '../../types';
import './UrlForm.css';

type UrlFormProps = {
  qty: string;
  onQtyChange: (value: string) => void;
  alias: string;
  onAliasChange: (value: string) => void;
  url: string;
  onUrlChange: (value: string) => void;
  error: string; // '' = no error
  qtyError: boolean; // the error is a missing quantity (shown on the dropdown)
  inputAnim: InputAnim;
  onInputAnimEnd: () => void;
  onSubmit: () => void;
};

/**
 * Quantity + alias + URL on one row, with the Add button inside the URL
 * input's right edge. It's a form, so Enter in either text input submits.
 */
export default function UrlForm({
  qty,
  onQtyChange,
  alias,
  onAliasChange,
  url,
  onUrlChange,
  error,
  qtyError,
  inputAnim,
  onInputAnimEnd,
  onSubmit,
}: UrlFormProps) {
  // The error belongs to the URL input unless it's a missing quantity.
  const urlHasError = !!error && !qtyError;

  const qtySelectClass = [
    'qtySelect',
    !qty && 'qtySelectEmpty',
    qtyError && 'qtySelectError',
    qtyError && inputAnim === 'shake' && 'qtySelectShake',
  ]
    .filter(Boolean)
    .join(' ');

  const urlInputClass = [
    'urlInput',
    urlHasError && 'urlInputError',
    !qtyError && inputAnim === 'shake' && 'urlInputShake',
    inputAnim === 'success' && 'urlInputSuccess',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="inputField">
      <form
        className="inputRow"
        onSubmit={(e) => {
          e.preventDefault(); // stop the page from reloading
          onSubmit();
        }}
      >
        {/* qty picker: leftmost on the row. A styled native <select>,
            so keyboard and screen-reader support come built in. */}
        <select
          className={qtySelectClass}
          aria-label="Quantity"
          value={qty}
          onChange={(e) => onQtyChange(e.target.value)}
          onAnimationEnd={onInputAnimEnd}
          aria-invalid={qtyError}
          aria-describedby={qtyError ? 'urlError' : undefined}
        >
          <option value="" disabled>
            Quantity
          </option>
          {QUANTITIES.map((quantity) => (
            <option key={quantity} value={quantity}>
              {quantity}
            </option>
          ))}
        </select>
        <input
          className="aliasInput"
          type="text"
          placeholder="Alias (optional)"
          aria-label="Alias for this item (optional)"
          value={alias}
          onChange={(e) => onAliasChange(e.target.value)}
          maxLength={40}
        />
        <div className="inputWrap">
          <input
            className={urlInputClass}
            type="text"
            placeholder="Paste product page URL here"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onAnimationEnd={onInputAnimEnd}
            aria-invalid={urlHasError}
            aria-describedby={urlHasError ? 'urlError' : undefined}
          />
          <button type="submit" className="inputButton" aria-label="Add URL">
            Add
          </button>
        </div>
      </form>
      {/* Outside the form so it doesn't shift the button's vertical centering. */}
      {error && (
        <p
          id="urlError"
          className={`urlErrorText${qtyError ? ' urlErrorTextQty' : ''}`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
