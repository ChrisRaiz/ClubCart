// Small line-drawn UI icons (trash, copy, check). They use currentColor, so
// the surrounding button's CSS sets their color.

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Trash can — delete a list row. */
export function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
        {...stroke}
        strokeWidth="2"
      />
    </svg>
  );
}

/** Two overlapping pages — copy. */
export function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="8"
        y="8"
        width="12"
        height="12"
        rx="2"
        {...stroke}
        strokeWidth="2"
      />
      <path
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
        {...stroke}
        strokeWidth="2"
      />
    </svg>
  );
}

/** Check mark — copied. */
export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" {...stroke} strokeWidth="2.5" />
    </svg>
  );
}
