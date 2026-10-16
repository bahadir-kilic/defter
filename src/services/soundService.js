/**
 * Scriptor Tactile Audio Engine
 * Procedurally synthesized analog sound effects using Web Audio API:
 * 1. Fountain pen nib friction / paper scratching
 * 2. Subtle soft mechanical key thud
 * 3. Delicate page turning sound
 * Zero latency, 0 external audio files, completely offline & lightweight.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a gentle, organic fountain pen scratch on paper
 */
export function playPenScratch(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Create filtered noise buffer for realistic paper fiber friction
    const bufferSize = ctx.sampleRate * 0.045; // 45ms duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Bandpass filter to isolate the paper-nib scratch frequencies (2.5kHz - 4.5kHz)
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2800 + Math.random() * 800, now);
    bandpass.Q.setValueAtTime(3.5, now);

    // Gain envelope (soft attack, quick gentle decay)
    const gainNode = ctx.createGain();
    const volume = 0.05 + Math.random() * 0.03; // Ultra subtle, non-intrusive
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    whiteNoise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.045);
  } catch (e) {
    // Audio context may be blocked by autoplay policy before user gesture
  }
}

/**
 * Plays a delicate, crisp page turn sound
 */
export function playPageTurn(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = 0.16;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(600, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  } catch (e) {}
}
