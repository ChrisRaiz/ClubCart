// Small UI sound effects, synthesized with the Web Audio API so there are no
// audio files to bundle. Each sound is a few short oscillator "notes".

let ctx: AudioContext | null = null;

/** One shared AudioContext, created on first use (after a user click). */
function getContext() {
  if (!ctx) ctx = new AudioContext();
  // Browsers can suspend audio until a user gesture; resume just in case.
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

type Note = {
  freq: number; // pitch in Hz
  start: number; // seconds after the sound begins
  duration: number; // seconds
  type?: OscillatorType; // waveform: 'sine' | 'square' | 'triangle' | 'sawtooth'
  volume?: number; // 0–1, before the master volume
  slideTo?: number; // optional pitch to glide to by the end of the note
};

const MASTER_VOLUME = 0.18; // keep UI sounds quiet

function play(notes: Note[]) {
  try {
    const audio = getContext();
    const now = audio.currentTime;

    notes.forEach(
      ({ freq, start, duration, type = 'square', volume = 1, slideTo }) => {
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        const t0 = now + start;
        const t1 = t0 + duration;

        osc.type = type;
        osc.frequency.setValueAtTime(freq, t0);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t1);

        // Quick fade in and out so notes don't click.
        const peak = MASTER_VOLUME * volume;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t1);

        osc.connect(gain).connect(audio.destination);
        osc.start(t0);
        osc.stop(t1 + 0.02);
      },
    );
  } catch {
    // Audio unavailable (e.g. no output device); sounds are optional.
  }
}

/** Bright rising two-note chime, like a retro "item get". */
export function playSuccess() {
  play([
    { freq: 880, start: 0, duration: 0.09, type: 'square', volume: 0.7 },
    { freq: 1318.5, start: 0.08, duration: 0.18, type: 'square', volume: 0.7 },
    // Soft sine an octave up for a little sparkle.
    { freq: 2637, start: 0.08, duration: 0.16, type: 'sine', volume: 0.35 },
  ]);
}

/**
 * Finale fanfare: a quick rising arpeggio (C–E–G–C), then a held major chord
 * with a high shimmer on top, like a "level complete" jingle.
 */
export function playFinale() {
  const step = 0.085; // time between arpeggio notes
  const chordStart = step * 4;

  play([
    // Arpeggio up: C5, E5, G5, C6
    { freq: 523.25, start: 0, duration: 0.1, volume: 0.6 },
    { freq: 659.25, start: step, duration: 0.1, volume: 0.6 },
    { freq: 783.99, start: step * 2, duration: 0.1, volume: 0.6 },
    { freq: 1046.5, start: step * 3, duration: 0.12, volume: 0.65 },

    // Held C major chord (C5, E5, G5, C6), softer triangle wave so it blends.
    {
      freq: 523.25,
      start: chordStart,
      duration: 0.7,
      type: 'triangle',
      volume: 0.9,
    },
    {
      freq: 659.25,
      start: chordStart,
      duration: 0.7,
      type: 'triangle',
      volume: 0.75,
    },
    {
      freq: 783.99,
      start: chordStart,
      duration: 0.7,
      type: 'triangle',
      volume: 0.75,
    },
    {
      freq: 1046.5,
      start: chordStart,
      duration: 0.75,
      type: 'square',
      volume: 0.35,
    },

    // Shimmer: two quick high sparkles over the chord.
    {
      freq: 2093,
      start: chordStart + 0.05,
      duration: 0.18,
      type: 'sine',
      volume: 0.3,
    },
    {
      freq: 2637,
      start: chordStart + 0.2,
      duration: 0.3,
      type: 'sine',
      volume: 0.25,
    },
  ]);
}

/** Short "starting up" blip: a quick upward sweep. */
export function playStart() {
  play([
    {
      freq: 392,
      start: 0,
      duration: 0.12,
      type: 'square',
      volume: 0.5,
      slideTo: 784,
    },
  ]);
}

/** Soft, short tick for each item that finishes while a batch is running. */
export function playTick() {
  play([{ freq: 1568, start: 0, duration: 0.05, type: 'sine', volume: 0.45 }]);
}

/**
 * Reset "whoosh": a quick downward sweep with a soft high tail,
 * like everything being swept away.
 */
export function playReset() {
  play([
    {
      freq: 1200,
      start: 0,
      duration: 0.32,
      type: 'triangle',
      volume: 0.8,
      slideTo: 180,
    },
    {
      freq: 2400,
      start: 0,
      duration: 0.2,
      type: 'sine',
      volume: 0.25,
      slideTo: 600,
    },
    // Little "pop" as the fresh screen appears.
    { freq: 660, start: 0.36, duration: 0.07, type: 'square', volume: 0.45 },
  ]);
}

/** Short low double buzz with a downward slide. */
export function playError() {
  play([
    { freq: 220, start: 0, duration: 0.1, type: 'sawtooth', slideTo: 180 },
    { freq: 180, start: 0.12, duration: 0.16, type: 'sawtooth', slideTo: 120 },
  ]);
}
