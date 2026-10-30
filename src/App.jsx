import { DeveloperCard } from './components/DeveloperCard.jsx';

const MY_AVATAR_URL =
  'https://cdn.phototourl.com/member/2026-10-30-fa6e7760-a60d-4fb1-b29c-db617cb360b0.jpg';

export function App() {
  return (
    <main>
      <h1>Lab 03 In-class Sprints</h1>
      <section aria-label='Exercise 1: Developer Card'>
        <DeveloperCard
          fullName='Nguyen Tran Khai Hung'
          avatarUrl={MY_AVATAR_URL}
        />
      </section>
    </main>
  );
}
