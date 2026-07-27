import { useEffect, useState } from 'react';
import { api } from '../api.js';

const MOODS = [
  { value: 'HAPPY', label: 'Happy', icon: '🙂', className: 'happy' },
  { value: 'OKAY', label: 'Okay', icon: '😐', className: 'okay' },
  { value: 'NOT_GREAT', label: 'Not Great', icon: '🙁', className: 'not_great' },
];

/**
 * Wellbeing check-in screen (Section 5.4).
 * - Three discrete mood options only, not a slider/free text (DR-4, DR-5,
 *   and the rationale in Section 5.3.2, peer feedback point 1: colour is
 *   never the only signal - every mood option always shows icon + label).
 * - Quick-contact escalation surfaced only after a mood is selected
 *   (DR-8), using the FAVOURITE / EMERGENCY contacts from the backend.
 * - Save persists the check-in via POST /api/checkins (one primary action,
 *   DR-5), recording whether escalation was used (DR-9 data minimisation -
 *   we store only a boolean flag, not which contact or why).
 */
export default function Wellbeing() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [escalated, setEscalated] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getContacts().then(setContacts).catch(() => setError('Could not load contacts.'));
  }, []);

  const favourite = contacts.find((c) => c.role === 'FAVOURITE');
  const emergency = contacts.find((c) => c.role === 'EMERGENCY');

  async function handleSave() {
    if (!selectedMood) return;
    try {
      await api.createCheckIn(selectedMood, escalated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Could not save your check-in. Please try again.');
    }
  }

  return (
    <div className="screen">
      <h1>Daily Wellbeing Check</h1>
      <p className="secondary-text" style={{ marginTop: -8, marginBottom: 24 }}>
        How are you feeling today?
      </p>

      <div className="mood-list" role="radiogroup" aria-label="Select your mood">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            type="button"
            role="radio"
            aria-checked={selectedMood === mood.value}
            className={`mood-option ${mood.className} ${selectedMood === mood.value ? 'selected' : ''}`}
            onClick={() => setSelectedMood(mood.value)}
          >
            <span className="icon" aria-hidden="true">{mood.icon}</span>
            {mood.label}
          </button>
        ))}
      </div>

      {selectedMood && (
        <>
          <p className="secondary-text" style={{ marginBottom: 8 }}>Need to talk?</p>
          <div className="escalation">
            {favourite && (
              <a
                href={`tel:${favourite.phoneNumber}`}
                className="btn-favourite tap-target"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                onClick={() => setEscalated(true)}
              >
                Call {favourite.name} (Favourite)
              </a>
            )}
            {emergency && (
              <a
                href={`tel:${emergency.phoneNumber}`}
                className="btn-emergency tap-target"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                onClick={() => setEscalated(true)}
              >
                Call Emergency
              </a>
            )}
          </div>
        </>
      )}

      <button type="button" className="btn-primary" disabled={!selectedMood} onClick={handleSave}>
        Save
      </button>

      {saved && (
        <p role="status" style={{ color: 'var(--color-positive)', marginTop: 12 }}>
          ✓ Check-in saved
        </p>
      )}
      {error && (
        <p role="alert" style={{ color: 'var(--color-negative)', marginTop: 12 }}>
          {error}
        </p>
      )}
    </div>
  );
}
