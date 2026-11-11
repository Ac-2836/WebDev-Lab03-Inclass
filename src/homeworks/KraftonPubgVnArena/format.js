// mm:ss, rounded up so the display reads 00:00 only once the drop is live.
export function formatCountdown(remainingMs) {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
