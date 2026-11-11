import { useReducer } from 'react';
import {
  availableEvents,
  EVENT_LABEL,
  INITIAL_PHASE,
  PHASE_LABEL,
  phaseReducer,
} from './situationship-machine.js';

export function SituationshipAnalyzer() {
  const [phase, dispatch] = useReducer(phaseReducer, INITIAL_PHASE);

  return (
    <article aria-labelledby='situationship-heading'>
      <h2 id='situationship-heading'>Hẹn Hò Nhưng Không Yêu Analyzer</h2>
      <output>{PHASE_LABEL[phase]}</output>
      <ul aria-label='Possible moves'>
        {availableEvents(phase).map((event) => (
          <li key={event}>
            <button type='button' onClick={() => dispatch(event)}>
              {EVENT_LABEL[event]}
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}
