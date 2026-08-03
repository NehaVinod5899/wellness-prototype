import { useEffect, useState } from 'react';
import { api } from '../api.js';
import ReadAloudButton from '../components/ReadAloudButton.jsx';

/**
 * Community screen 
 */
export default function Community() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    api.getGroups().then(setGroups).catch(() => setError('Could not load community groups.'));
  }

  async function toggle(group) {
    try {
      if (group.joined) {
        await api.leaveGroup(group.id);
      } else {
        await api.joinGroup(group.id);
      }
      refresh();
    } catch {
      setError('Could not update this group. Please try again.');
    }
  }

  return (
    <div className="screen">
      <h1>Community</h1>
      <ReadAloudButton
        text={
          groups.length
            ? `Community. Suggested for you: ${groups.map((g) => `${g.name}, ${g.schedule}`).join('. ')}.`
            : 'Community. No suggested groups yet.'
        }
      />
      <p className="secondary-text" style={{ marginTop: -8, marginBottom: 24 }}>
        Suggested for you
      </p>

      {error && <p role="alert">{error}</p>}

      {groups.map((group) => (
        <div className="group-card" key={group.id}>
          <div>
            <p className="name">{group.name}</p>
            <p className="secondary-text">{group.schedule}</p>
          </div>
          <button
            type="button"
            className={`join-btn tap-target ${group.joined ? 'joined' : 'not-joined'}`}
            onClick={() => toggle(group)}
          >
            {group.joined ? 'Leave' : 'Join'}
          </button>
        </div>
      ))}
    </div>
  );
}
