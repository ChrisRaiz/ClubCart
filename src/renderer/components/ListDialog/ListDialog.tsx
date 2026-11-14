import type { RefObject } from 'react';
import ListRow from './ListRow';
import type { UrlEntry } from '../../types';
import './ListDialog.css';

type ListDialogProps = {
  // The parent holds the ref so it can open/close the dialog
  // (dialogRef.current.showModal() / .close()).
  dialogRef: RefObject<HTMLDialogElement | null>;
  urls: UrlEntry[];
  onRemove: (url: string) => void;
};

/**
 * The list modal. A native <dialog>: showModal() dims the page behind it,
 * traps focus inside, and Esc closes it. Clicking the backdrop closes it too.
 */
export default function ListDialog({
  dialogRef,
  urls,
  onRemove,
}: ListDialogProps) {
  const close = () => dialogRef.current?.close();

  return (
    // Backdrop click is a mouse shortcut; keyboard users have Esc and the ✕ button.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className="listDialog"
      onClick={(e) => {
        // The click target is the <dialog> itself only on the backdrop area.
        if (e.target === e.currentTarget) close();
      }}
    >
      <section className="listCard">
        <header className="listHeader">
          <h2>List</h2>
          <div className="listHeaderRight">
            <span className="listCount">{urls.length}</span>
            <button
              type="button"
              className="listClose"
              aria-label="Close list"
              onClick={close}
            >
              ✕
            </button>
          </div>
        </header>
        {urls.length ? (
          <ul className="listBody">
            {/* URLs are unique (addUrl skips duplicates), so they work as keys. */}
            {urls.map((entry, i) => (
              <ListRow
                key={entry.url}
                entry={entry}
                index={i}
                onRemove={onRemove}
              />
            ))}
          </ul>
        ) : (
          <p className="listEmpty">Nothing here yet.</p>
        )}
      </section>
    </dialog>
  );
}
