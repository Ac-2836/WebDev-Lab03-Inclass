const FLOOR = 0.0001;
const ATTACK_S = 0.005; // short ramp up: no click at note start
const RELEASE_S = 0.04; // exponential ramp down before stop(): no pop
const HEADROOM = 0.8; // all voices at full level still sum to <= 0.8

// Slide contract: constructor(maxVoices = 8), noteOn(midi, freqHz),
// noteOff(midi). `voices` is a Map, so insertion order is FIFO order.
export class PolyphonicSynth {
  constructor(maxVoices = 8) {
    this.ctx = null;
    this.maxVoices = maxVoices;
    this.voices = new Map(); // midi -> { osc, gain }
  }

  noteOn(midi, freqHz) {
    // Created on the first note: a user gesture, as autoplay policy needs.
    if (!this.ctx) this.ctx = new window.AudioContext();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (this.voices.has(midi)) return;
    if (this.voices.size >= this.maxVoices) {
      this.noteOff(this.voices.keys().next().value); // FIFO voice stealing
    }
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(freqHz, now);
    gain.gain.setValueAtTime(FLOOR, now);
    const level = HEADROOM / this.maxVoices;
    gain.gain.linearRampToValueAtTime(level, now + ATTACK_S);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(now);
    this.voices.set(midi, { osc, gain });
  }

  noteOff(midi) {
    const voice = this.voices.get(midi);
    if (!voice) return;
    this.voices.delete(midi);
    const { osc, gain } = voice;
    const now = this.ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.exponentialRampToValueAtTime(FLOOR, now + RELEASE_S);
    osc.stop(now + RELEASE_S);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  allNotesOff() {
    [...this.voices.keys()].forEach((midi) => this.noteOff(midi));
  }

  close() {
    this.allNotesOff();
    this.ctx?.close();
    this.ctx = null;
  }
}
