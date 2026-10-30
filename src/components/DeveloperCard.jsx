import { Fragment, useId, useState } from 'react';
import { SkillBadge } from './SkillBadge.jsx';
import styles from './DeveloperCard.module.css';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240';

function getInitials(fullName) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

export function DeveloperCard({
  fullName = 'Tran Vinh Khiem',
  role = 'Senior Systems Architect • UIT S3T',
  avatarUrl = DEFAULT_AVATAR,
  metrics = { commits: 512, vdomNodes: 0, a11yScore: 100 },
  skills = [{ id: 'sk-1', name: 'React 19 Fiber', tier: 'Core' }],
}) {
  const headingId = useId();
  const [isAvatarBroken, setIsAvatarBroken] = useState(false);
  const showAvatar = avatarUrl.startsWith('https://') && !isAvatarBroken;

  return (
    <article className={styles.card} aria-labelledby={headingId}>
      <header className={styles.header}>
        {showAvatar ? (
          <img
            className={styles.avatar}
            src={avatarUrl}
            alt={fullName}
            width='64'
            height='64'
            onError={() => setIsAvatarBroken(true)}
          />
        ) : (
          <span
            className={`${styles.avatar} ${styles.initials}`}
            role='img'
            aria-label={fullName}
          >
            {getInitials(fullName)}
          </span>
        )}
        <hgroup className={styles.title}>
          <h2 id={headingId}>{fullName}</h2>
          <p>{role}</p>
        </hgroup>
      </header>
      <dl className={styles.metrics}>
        {Object.entries(metrics).map(([metric, value]) => (
          <Fragment key={metric}>
            <dt>{metric}</dt>
            <dd>{value}</dd>
          </Fragment>
        ))}
      </dl>
      <ul className={styles.skills} aria-label='Engineered Skills'>
        {skills.map((skill) => (
          <SkillBadge key={skill.id} name={skill.name} tier={skill.tier} />
        ))}
      </ul>
    </article>
  );
}
