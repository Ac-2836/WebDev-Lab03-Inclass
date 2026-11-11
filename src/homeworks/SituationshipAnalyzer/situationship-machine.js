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

// The relationship phase plus the one thing that can ghost it: a message
// still waiting for a reply. Leaving DATING_NO_LOVE drops the waiting message.
export const INITIAL_STATE = { phase: INITIAL_PHASE, awaitingReplyId: null };

/**
 * Actions: { type: <phase event> } | { type: 'SEND_MESSAGE', id } |
 * { type: 'REPLY' }. `id` is made by the caller so this stays pure.
 */
export function situationReducer(state, action) {
  switch (action.type) {
    case 'SEND_MESSAGE':
      return state.phase === 'DATING_NO_LOVE'
        ? { ...state, awaitingReplyId: action.id }
        : state;
    case 'REPLY':
      return state.awaitingReplyId === null
        ? state
        : { ...state, awaitingReplyId: null };
    default: {
      const phase = phaseReducer(state.phase, action.type);
      return phase === state.phase ? state : { phase, awaitingReplyId: null };
    }
  }
}

