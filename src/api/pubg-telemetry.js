const PACKET_LOSS_RATE = 0.35;
const SQUADS_URL = `${import.meta.env.BASE_URL}api/pubg-vn-squads.json`;

function waitFor(ms, signal) {
  return new Promise((resolve, reject) => {
    signal?.throwIfAborted();
    const timerId = window.setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timerId);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

// Real abortable request (visible in the Network panel), then simulated
// satellite latency and 35% Erangel/Miramar packet loss.
export async function fetchKraftonPubgTelemetry(squadId, { signal } = {}) {
  const url = `${SQUADS_URL}?squad=${encodeURIComponent(squadId)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Telemetry HTTP ${res.status}`);
  const squads = await res.json();
  await waitFor(800 + Math.random() * 700, signal);
  if (Math.random() < PACKET_LOSS_RATE) {
    throw new Error('Satellite packet loss, telemetry timed out');
  }
  const squad = squads.find((s) => s.id === squadId);
  if (!squad) throw new Error(`Unknown squad: ${squadId}`);
  return squad;
}
