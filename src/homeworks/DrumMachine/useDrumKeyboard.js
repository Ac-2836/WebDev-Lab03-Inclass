import { useEffect } from 'react';

const TEXT_FIELDS = ['INPUT', 'TEXTAREA', 'SELECT'];

// Slide contract: useDrumKeyboard(padMap, onTriggerPad, isEnabled = true).
// padMap is Map<KeyboardEvent.code, { id, ... }>.
export function useDrumKeyboard(padMap, onTriggerPad, isEnabled = true) {
  useEffect(() => {
    if (!isEnabled) return undefined;

    const onKeyDown = (e) => {
      if (e.repeat) return; // OS auto-repeat must not re-trigger a hit
      // Ctrl / Meta / Alt combos are browser and assistive-tech shortcuts.
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (TEXT_FIELDS.includes(e.target.tagName)) return;
      const pad = padMap.get(e.code);
      if (pad) {
        e.preventDefault();
        onTriggerPad(pad.id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [padMap, onTriggerPad, isEnabled]);
}
