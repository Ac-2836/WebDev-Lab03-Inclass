export const REPLY_WINDOW_MS = 5000;

// Resolves when the reply window passes without an answer; rejects with the
// signal's reason (and clears its timer) as soon as the wait is aborted.
export function waitForReply(signal, ms = REPLY_WINDOW_MS) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const onAbort = () => {
      window.clearTimeout(timerId);
      reject(signal.reason);
    };
    const timerId = window.setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}
