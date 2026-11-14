// Pixel-art button icons, drawn on a 12×12 grid to match the retro pixel
// title font. Each icon is a list of 12-character rows, one character per pixel:
//   '#'  outline   → the button's text color (currentColor)
//   'r'  accent    → red, like the ball emblem (CSS var --icon-accent)
//   'w'  highlight → white (CSS var --icon-light)
//   '.'  empty
// Sized and animated by .btnIcon in icons.css.

import type { ReactElement } from 'react';
import './icons.css';

const COLORS: Record<string, string> = {
  '#': 'currentColor',
  r: 'var(--icon-accent, var(--red))',
  w: 'var(--icon-light, #fff)',
};

// Drop shadow, like the title text's: a solid copy of the icon's silhouette,
// offset 1 pixel down and right, in blue (CSS var --icon-shadow).
const SHADOW_COLOR = 'var(--icon-shadow, var(--blue))';
const SHADOW_OFFSET = 1;

/**
 * Turns a pixel grid into SVG rects, merging horizontal runs of one color.
 * `color` forces every filled pixel to one color (used for the shadow).
 */
function gridToRects(rows: string[], offset: number, color?: string) {
  const rects: ReactElement[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      // For the shadow, any filled pixel counts, regardless of its color.
      const filled = (c: string) => Boolean(COLORS[c]);
      const ch = row[x];
      let end = x + 1;
      while (
        end < row.length &&
        (color ? filled(row[end]) === filled(ch) : row[end] === ch)
      ) {
        end += 1;
      }
      if (COLORS[ch]) {
        rects.push(
          <rect
            key={`${color ? 's' : 'p'}${x},${y}`}
            x={x + offset}
            y={y + offset}
            width={end - x}
            height={1}
            fill={color ?? COLORS[ch]}
          />,
        );
      }
      x = end;
    }
  });
  return rects;
}

/** Renders a pixel grid as crisp SVG pixels with a title-style drop shadow. */
function PixelIcon({ rows }: { rows: string[] }) {
  // The canvas grows by the shadow offset so the shadow isn't cut off.
  const width = rows[0].length + SHADOW_OFFSET;
  const height = rows.length + SHADOW_OFFSET;

  return (
    <svg
      className="btnIcon"
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges" // hard pixel edges, no anti-aliasing
      aria-hidden="true"
    >
      {/* Shadow first, so the icon is drawn on top of it. */}
      {gridToRects(rows, SHADOW_OFFSET, SHADOW_COLOR)}
      {gridToRects(rows, 0)}
    </svg>
  );
}

/** Clipboard with three rows and red bullets — "your list". */
const LIST = [
  '....####....',
  '..##wwww##..',
  '.#ww####ww#.',
  '.#wwwwwwww#.',
  '.#rw#####w#.',
  '.#wwwwwwww#.',
  '.#rw#####w#.',
  '.#wwwwwwww#.',
  '.#rw#####w#.',
  '.#wwwwwwww#.',
  '.##########.',
  '............',
];

/** Magic wand with a red sparkle and a twinkle — "make it". */
const GENERATE = [
  '........r...',
  '........r...',
  '.#.....rwr..',
  '###..rrwwwrr',
  '.#.....rwr..',
  '........r...',
  '....##..r...',
  '...#w#......',
  '..#w#.......',
  '.#w#........',
  '#w#.........',
  '##..........',
];

/** Circular arrow (pointing up on the left) with a red center — "start over". */
const RESET = [
  '.....###....',
  '.#......##..',
  '###.......#.',
  '.#........#.',
  '#..........#',
  '#....rr....#',
  '#....rr....#',
  '#..........#',
  '.#........#.',
  '.#........#.',
  '..##....##..',
  '....####....',
];

export function ListIcon() {
  return <PixelIcon rows={LIST} />;
}

export function GenerateIcon() {
  return <PixelIcon rows={GENERATE} />;
}

export function ResetIcon() {
  return <PixelIcon rows={RESET} />;
}
