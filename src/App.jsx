import { useState } from 'react';
import { DeveloperCard } from './components/DeveloperCard.jsx';
import { ScientistDirectory } from './components/ScientistDirectory.jsx';
import { PubgMatchTelemetry } from './components/PubgMatchTelemetry.jsx';
import styles from './App.module.css';

const MY_AVATAR_URL =
  'https://cdn.phototourl.com/member/2026-10-30-fa6e7760-a60d-4fb1-b29c-db617cb360b0.jpg';

// One tab per exercise; only the active panel is mounted, so leaving a tab
// runs its effect cleanups (e.g. aborts in-flight telemetry requests).
const TABS = [
  {
    id: 'ex1',
    label: 'Ex 1 · Developer Card',
    render: () => (
      <DeveloperCard
        fullName='Nguyen Tran Khai Hung'
        avatarUrl={MY_AVATAR_URL}
      />
    ),
  },
  {
    id: 'ex2',
    label: 'Ex 2 · Scientist Directory',
    render: () => <ScientistDirectory />,
  },
  {
    id: 'ex3',
    label: 'Ex 3 · PUBG VN Telemetry',
    render: () => <PubgMatchTelemetry />,
  },
];

const KEY_STEPS = { ArrowRight: 1, ArrowLeft: -1 };

export function App() {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const active = TABS.find((tab) => tab.id === activeId);

  // WAI-ARIA tabs pattern: arrows / Home / End move focus and selection.
  const handleTabKey = (e) => {
    const index = TABS.findIndex((tab) => tab.id === activeId);
    let next;
    if (e.code in KEY_STEPS) {
      next = (index + KEY_STEPS[e.code] + TABS.length) % TABS.length;
    } else if (e.code === 'Home') {
      next = 0;
    } else if (e.code === 'End') {
      next = TABS.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    setActiveId(TABS[next].id);
    document.getElementById(`tab-${TABS[next].id}`).focus();
  };

  return (
    <main>
      <h1>Lab 03</h1>
      <nav
        className={styles.tablist}
        role='tablist'
        aria-label='Lab 03 exercises'
        onKeyDown={handleTabKey}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type='button'
            role='tab'
            className={styles.tab}
            aria-selected={tab.id === activeId}
            aria-controls={`panel-${tab.id}`}
            tabIndex={tab.id === activeId ? 0 : -1}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <section
        id={`panel-${active.id}`}
        role='tabpanel'
        aria-labelledby={`tab-${active.id}`}
        tabIndex={0}
      >
        {active.render()}
      </section>
    </main>
  );
}
