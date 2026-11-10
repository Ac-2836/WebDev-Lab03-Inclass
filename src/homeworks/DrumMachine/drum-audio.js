const FLOOR = 0.0001;
const OUTPUT_GAIN = 1.4; // makeup gain after the limiter

// Exponential decay from `level`; every voice fades to FLOOR before stopping,
// so no click is produced when the source ends.
function envelope(ctx, level, decay, when) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(level, when);
  gain.gain.exponentialRampToValueAtTime(FLOOR, when + decay);
  return gain;
}

// Disconnect a finished source and its nodes so none are left in the graph.
function releaseOnEnd(source, ...nodes) {
  source.onended = () => {
    source.disconnect();
    nodes.forEach((node) => node.disconnect());
  };
}

function tone(ctx, dest, { type = 'sine', from, to, decay, level, delay = 0 }) {
  const when = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, when);
  osc.frequency.exponentialRampToValueAtTime(to, when + decay);
  const gain = envelope(ctx, level, decay, when);
  osc.connect(gain).connect(dest);
  releaseOnEnd(osc, gain);
  osc.start(when);
  osc.stop(when + decay);
}

const noiseBuffers = new WeakMap();

function noiseBuffer(ctx) {
  if (!noiseBuffers.has(ctx)) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    noiseBuffers.set(ctx, buffer);
  }
  return noiseBuffers.get(ctx);
}

function noise(ctx, dest, { filter, freq, decay, level, delay = 0 }) {
  const when = ctx.currentTime + delay;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  const biquad = ctx.createBiquadFilter();
  biquad.type = filter;
  biquad.frequency.value = freq;
  const gain = envelope(ctx, level, decay, when);
  source.connect(biquad).connect(gain).connect(dest);
  releaseOnEnd(source, biquad, gain);
  source.start(when);
  source.stop(when + decay);
}

const VOICES = {
  kick: (ctx, dest) =>
    tone(ctx, dest, { from: 150, to: 45, decay: 0.35, level: 1 }),
  snare: (ctx, dest) => {
    noise(ctx, dest, {
      filter: 'highpass', freq: 1800, decay: 0.2, level: 0.7,
    });
    tone(ctx, dest, {
      type: 'triangle', from: 220, to: 160, decay: 0.12, level: 0.5,
    });
  },
  hihat: (ctx, dest) =>
    noise(ctx, dest, {
      filter: 'highpass', freq: 7000, decay: 0.06, level: 0.5,
    }),
  crash: (ctx, dest) =>
    noise(ctx, dest, {
      filter: 'highpass', freq: 4500, decay: 0.9, level: 0.5,
    }),
  tom: (ctx, dest) =>
    tone(ctx, dest, { from: 220, to: 90, decay: 0.3, level: 0.9 }),
  clap: (ctx, dest) => {
    [0, 0.012, 0.024].forEach((delay) =>
      noise(ctx, dest, {
        filter: 'bandpass', freq: 1500, decay: 0.08, level: 0.6, delay,
      }));
  },
  ride: (ctx, dest) => {
    [3100, 4700].forEach((freq) =>
      tone(ctx, dest, {
        type: 'square', from: freq, to: freq, decay: 0.5, level: 0.1,
      }));
    noise(ctx, dest, {
      filter: 'highpass', freq: 8000, decay: 0.5, level: 0.15,
    });
  },
};

// Exported separately so a voice can be rendered offline and measured.
export function playVoice(ctx, dest, padId) {
  VOICES[padId]?.(ctx, dest);
}

// Every voice feeds a limiter (fast, hard compressor) so a chord of pads
// cannot sum past full scale; OUTPUT_GAIN is measured to keep peaks < 1.
export function createMasterBus(ctx) {
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -18;
  limiter.knee.value = 0;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.001;
  limiter.release.value = 0.12;
  const output = ctx.createGain();
  output.gain.value = OUTPUT_GAIN;
  limiter.connect(output).connect(ctx.destination);
  return limiter;
}

// The AudioContext is created on the first hit (a user gesture, as browser
// autoplay policy requires) and closed by close() on unmount.
export function createDrumAudio() {
  let ctx = null;
  let master = null;
  return {
    play(padId) {
      if (!ctx) {
        ctx = new window.AudioContext();
        master = createMasterBus(ctx);
      }
      if (ctx.state === 'suspended') ctx.resume();
      playVoice(ctx, master, padId);
    },
    close() {
      ctx?.close();
      ctx = null;
      master = null;
    },
  };
}
