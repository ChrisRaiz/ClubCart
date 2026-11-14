import { GenerateIcon, ListIcon, ResetIcon } from '../icons';
import type { Progress } from '../../types';
import './ActionBar.css';

type ActionBarProps = {
  count: number; // items in the list (badge on the List button)
  addCount: number; // bumps on each add, to replay the badge pop
  onOpenList: () => void;
  onGenerate: () => void;
  progress: Progress | null; // null when nothing is running
  onReset: () => void;
  canReset: boolean;
  resetting: boolean;
};

/** The List, Generate Script and Reset buttons. */
export default function ActionBar({
  count,
  addCount,
  onOpenList,
  onGenerate,
  progress,
  onReset,
  canReset,
  resetting,
}: ActionBarProps) {
  const busy = progress !== null;

  return (
    <div className="actionBar">
      {/* Opens the list modal; the badge shows how many items it has. */}
      <button type="button" className="listOpen" onClick={onOpenList}>
        <ListIcon />
        List
        {/* New key on each add re-creates the badge, replaying its pop. */}
        <span
          key={addCount}
          className={`listCount${addCount ? ' listCountPop' : ''}`}
        >
          {count}
        </span>
      </button>

      {/* Disabled while running; shows a spinner and live count instead. */}
      <button
        type="button"
        className="createButton"
        onClick={onGenerate}
        disabled={busy}
        aria-busy={busy}
      >
        {progress ? (
          <>
            <span className="btnSpinner" aria-hidden="true" />
            Loading {progress.done}/{progress.total}…
          </>
        ) : (
          <>
            <GenerateIcon />
            Generate Script
          </>
        )}
      </button>

      {/* Resets everything to how it is when the app first opens. Disabled
          when there's nothing to reset, and while loading so a reset can't
          race it. */}
      <button
        type="button"
        className="resetButton"
        onClick={onReset}
        disabled={!canReset || busy || resetting}
        title={
          canReset ? 'Clear the list, output and input' : 'Nothing to reset'
        }
      >
        <ResetIcon />
        Reset
      </button>
    </div>
  );
}
