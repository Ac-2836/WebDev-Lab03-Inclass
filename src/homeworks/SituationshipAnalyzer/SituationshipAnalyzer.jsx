import { useId, useReducer, useState } from 'react';
import {
  ACTOR_LABEL,
  appendSignal,
  createSignal,
  impactOf,
} from './effort.js';
import {
  availableEvents,
  EVENT_LABEL,
  INITIAL_PHASE,
  PHASE_LABEL,
  phaseReducer,
} from './situationship-machine.js';

export function SituationshipAnalyzer() {
  const [phase, dispatch] = useReducer(phaseReducer, INITIAL_PHASE);
  const [signals, setSignals] = useState([]);

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
      <EffortLog
        signals={signals}
        onAdd={(signal) => setSignals((prev) => appendSignal(prev, signal))}
      />
    </article>
  );
}

function EffortLog({ signals, onAdd }) {
  const actorId = useId();
  const stepsId = useId();
  const weightId = useId();
  // The browser validates the form first (required, min, step); the
  // RangeError path below is the second line of defence.
  // Numbers stay '' while the field is empty, so it can be cleared.
  const [actor, setActor] = useState('EM');
  const [steps, setSteps] = useState(100);
  const [multiplier, setMultiplier] = useState(0.1);
  const [problem, setProblem] = useState('');

  const readNumber = (e) =>
    (Number.isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      onAdd(createSignal({ actor, steps, multiplier }));
      setProblem('');
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      setProblem(error.message);
    }
  };

  return (
    <section aria-labelledby='effort-heading'>
      <h3 id='effort-heading'>Effort log</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor={actorId}>Who</label>
        <select
          id={actorId}
          value={actor}
          onChange={(e) => setActor(e.target.value)}
        >
          {Object.entries(ACTOR_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <label htmlFor={stepsId}>Steps</label>
        <input
          id={stepsId}
          type='number'
          min='1'
          required
          value={steps}
          onChange={(e) => setSteps(readNumber(e))}
        />
        <label htmlFor={weightId}>Weight per step</label>
        <input
          id={weightId}
          type='number'
          min='0'
          step='0.05'
          required
          value={multiplier}
          onChange={(e) => setMultiplier(readNumber(e))}
        />
        <button type='submit'>Log signal</button>
      </form>
      {problem && <p role='alert'>{problem}</p>}
      <ol aria-label='Effort signals'>
        {signals.map((signal) => (
          <li key={signal.id}>
            {ACTOR_LABEL[signal.actor]}: {signal.steps} x {signal.multiplier}
            {' '}= {impactOf(signal)}
          </li>
        ))}
      </ol>
    </section>
  );
}
