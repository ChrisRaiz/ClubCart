import { TrashIcon } from '../icons';
import type { UrlEntry } from '../../types';

type ListRowProps = {
  entry: UrlEntry;
  index: number; // 0-based position in the list
  onRemove: (url: string) => void;
};

/** One list item: number, alias/URL label, quantity badge, delete button. */
export default function ListRow({ entry, index, onRemove }: ListRowProps) {
  return (
    <li className="listRow">
      <span className="listIndex">{index + 1}</span>
      {/* Alias as the label with the URL beneath, or just the URL. */}
      <span className="listText" title={entry.url}>
        {entry.alias ? (
          <>
            <span className="listAlias">{entry.alias}</span>
            <span className="listUrl">{entry.url}</span>
          </>
        ) : (
          entry.url
        )}
      </span>
      {/* Quantity the entry was added with, if one was selected. */}
      {entry.qty && (
        <span className="listQty" title="Quantity">
          #{entry.qty}
        </span>
      )}
      <button
        type="button"
        className="listDelete"
        aria-label={`Remove ${entry.alias || entry.url}`}
        onClick={() => onRemove(entry.url)}
      >
        <TrashIcon />
      </button>
    </li>
  );
}
