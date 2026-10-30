export function SkillBadge({ name = 'Unknown Skill', tier = 'Core' }) {
  return (
    <li>
      {name} <small>({tier})</small>
    </li>
  );
}
