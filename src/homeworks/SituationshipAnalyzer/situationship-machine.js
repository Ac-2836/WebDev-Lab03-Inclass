/**
 * Slide contract: the relationship is ONE value of this union, never a set
 * of booleans (isDating / isLoved / hasTitle).
 *
 * @typedef {'FRIENDS' | 'DATING_NO_LOVE' | 'OFFICIAL_LOVE' | 'GHOSTED_EXIT'}
 *   RelationshipPhase
 */

// phase -> event -> next phase. Anything not listed is an invalid
// transition and is ignored.
const TRANSITIONS = {
  FRIENDS: { START_DATING: 'DATING_NO_LOVE', STOP: 'GHOSTED_EXIT' },
  DATING_NO_LOVE: {
    MAKE_OFFICIAL: 'OFFICIAL_LOVE',
    GHOSTED: 'GHOSTED_EXIT',
    STOP: 'GHOSTED_EXIT',
  },
  OFFICIAL_LOVE: { BREAK_UP: 'GHOSTED_EXIT' },
  GHOSTED_EXIT: { RESTART: 'FRIENDS' },
};

export const INITIAL_PHASE = 'FRIENDS';

export const PHASE_LABEL = {
  FRIENDS: 'Friends',
  DATING_NO_LOVE: 'Hẹn hò nhưng không yêu',
  OFFICIAL_LOVE: 'Official love (verified mutual commitment)',
  GHOSTED_EXIT: 'Ghosted exit (unmounted, memory freed)',
};

export const EVENT_LABEL = {
  START_DATING: 'Start dating',
  MAKE_OFFICIAL: 'Make it official',
  GHOSTED: 'Seen không rep',
  STOP: 'Dừng Lại',
  BREAK_UP: 'Break up',
  RESTART: 'Restart',
};

/** Events accepted in `phase`, in table order. */
export const availableEvents = (phase) => Object.keys(TRANSITIONS[phase]);

/** Pure reducer: an event invalid for the phase leaves the phase unchanged. */
export function phaseReducer(phase, event) {
  return TRANSITIONS[phase]?.[event] ?? phase;
}
