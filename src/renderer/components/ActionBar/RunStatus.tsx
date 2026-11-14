import type { Progress } from '../../types';

/**
 * Live status line while products load. role="status" also announces it to
 * screen readers. Always rendered (empty when idle) so the page doesn't jump
 * when it appears. Styled by .runStatus in ActionBar.css.
 */
export default function RunStatus({ progress }: { progress: Progress | null }) {
  return (
    <p className="runStatus" role="status">
      {progress &&
        `Loading product ${Math.min(progress.done + 1, progress.total)} of ${
          progress.total
        }… If a verification window opens, complete it to continue.`}
    </p>
  );
}
