import { Fragment } from 'react';
import { PAD_MAP } from './drum-pads.js';

export function DrumMachine() {
  return (
    <section aria-labelledby='drum-heading'>
      <h2 id='drum-heading'>Production Studio Drum Kit</h2>
      <dl>
        {[...PAD_MAP.values()].map((pad) => (
          <Fragment key={pad.id}>
            <dt>{pad.keyHint}</dt>
            <dd>{pad.label}</dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}
