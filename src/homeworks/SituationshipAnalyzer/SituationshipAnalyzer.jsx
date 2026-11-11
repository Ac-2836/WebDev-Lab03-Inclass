import { useEffect, useId, useReducer, useState } from 'react';
import {
  ACTOR_LABEL,
  analyzeEffort,
  appendSignal,
  createSignal,
  impactOf,
} from './effort.js';
import { REPLY_WINDOW_MS, waitForReply } from './reply-timer.js';
import {
  availableEvents,
  EVENT_LABEL,
  INITIAL_STATE,
  PHASE_LABEL,
  situationReducer,
} from './situationship-machine.js';
import styles from './SituationshipAnalyzer.module.css';

export function SituationshipAnalyzer() {
  const [{ phase, awaitingReplyId }, dispatch] = useReducer(
    situationReducer,
    INITIAL_STATE,
  );
  const [signals, setSignals] = useState([]);
  const meterId = useId();
  // Derived during render: nothing here is stored or synced by an effect.
  const { emScore, rivalScore, emShare, isRedFlag } = analyzeEffort(
    signals,
    phase,
  );

  // 'Seen không rep': a sent message starts a wait. No reply within the
  // window ghosts the relationship. The wait is aborted when the message is
  // answered, replaced, the phase changes, or the component unmounts.
  useEffect(() => {
    if (awaitingReplyId === null) return undefined;
    const controller = new AbortController();
    waitForReply(controller.signal).then(
      () => dispatch({ type: 'GHOSTED' }),
      (error) => {
        if (error.name !== 'AbortError') throw error;
      },
    );
    return () => controller.abort();
  }, [awaitingReplyId]);

  const logSignal = (signal) => {
    setSignals((prev) => appendSignal(prev, signal));
    // An 'Ai đó' signal is their answer to the waiting message.
    if (signal.actor === 'AI_DO') dispatch({ type: 'REPLY' });
  };

  return (
    <article className={styles.panel} aria-labelledby='situationship-heading'>
      <h2 id='situationship-heading'>Hẹn Hò Nhưng Không Yêu Analyzer</h2>
      <output className={styles.phase}>{PHASE_LABEL[phase]}</output>
      <ul className={styles.moves} aria-label='Possible moves'>
        {availableEvents(phase).map((event) => (
          <li key={event}>
            <button type='button' onClick={() => dispatch({ type: event })}>
              {EVENT_LABEL[event]}
            </button>
          </li>
        ))}
        {phase === 'DATING_NO_LOVE' && (
          <li>
            <button
              type='button'
              onClick={() =>
                dispatch({ type: 'SEND_MESSAGE', id: crypto.randomUUID() })}
            >
              Send message
            </button>
          </li>
        )}
      </ul>
      <output className={styles.waiting}>
        {awaitingReplyId === null
          ? ''
          : `Waiting for a reply (${REPLY_WINDOW_MS / 1000} s)...`}
      </output>
      <section className={styles.redFlag} aria-labelledby='redflag-heading'>
        <h3 id='redflag-heading'>Red-flag meter</h3>
        <p className={styles.meterRow}>
          <label htmlFor={meterId}>Em&apos;s share of the effort</label>
          <meter
            id={meterId}
            className={styles.meter}
            min={0}
            max={1}
            low={0.5}
            optimum={1}
            value={emShare}
          />
        </p>
        <dl className={styles.scores}>
          <dt>Em</dt>
          <dd>{emScore}</dd>
          <dt>Ai đó</dt>
          <dd>{rivalScore}</dd>
        </dl>
        <output
          className={styles.verdict}
          data-red-flag={isRedFlag}
          role='status'
          aria-live='polite'
        >
          {isRedFlag
            ? 'Red flag: em cố trăm lần không bằng ai đó một phần '
              + `(Em ${emScore} < Ai đó ${rivalScore}).`
            : 'Stable'}
        </output>
      </section>
      <EffortLog signals={signals} onAdd={logSignal} />
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
      <form className={styles.form} onSubmit={handleSubmit}>
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
      {problem && <p className={styles.alert} role='alert'>{problem}</p>}
      <ol className={styles.log} aria-label='Effort signals'>
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
