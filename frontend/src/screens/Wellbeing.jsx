import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';
import ReadAloudButton from '../components/ReadAloudButton.jsx';

const MOODS = [
  { value: 'HAPPY', label: 'Happy', icon: '🙂', className: 'happy' },
  { value: 'OKAY', label: 'Okay', icon: '😐', className: 'okay' },
  { value: 'NOT_GREAT', label: 'Not Great', icon: '🙁', className: 'not_great' },
];

/**
 * Wellbeing check-in screen
 *
 * Escalation behaviour (updated):
 * - Selecting "Not Great" automatically opens the escalation modal - the user does not have to notice or
 *   scroll to a button on a bad day). Happy/Okay do NOT trigger the modal;
 * - The modal is always dismissible ("Not now") - this is deliberately
 *   NOT a forced escalation. An older adult having a bad day still needs
 *   control over whether to reach out; 
 * - Dismissing the modal still leaves a manual "Need to talk?" section
 *   visible below, so the option remains reachable without being
 *   re-triggered on every interaction.
 */
export default function Wellbeing() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [escalated, setEscalated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getContacts().then(setContacts).catch(() => setError('Could not load contacts.'));
  }, []);

  const favourite = contacts.find((c) => c.role === 'FAVOURITE');
  const emergency = contacts.find((c) => c.role === 'EMERGENCY');

  function selectMood(moodValue) {
    setSelectedMood(moodValue);
    if (moodValue === 'NOT_GREAT') {
      setModalOpen(true);
    }
  }

  function handleCallFromModal() {
    setEscalated(true);
    setModalOpen(false);
    // tel: link navigation is handled by the anchor itself; this just
    // records that the user chose to reach out before the link fires.
  }

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
      <ReadAloudButton text="Daily wellbeing check. How are you feeling today? Choose Happy, Okay, or Not Great." />
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
            onClick={() => selectMood(mood.value)}
          >
            <span className="icon" aria-hidden="true">{mood.icon}</span>
            {mood.label}
          </button>
        ))}
      </div>

      {/* Manual escalation section - only relevant once "Not Great" has
          been selected; kept available after the modal is dismissed. */}
      {selectedMood === 'NOT_GREAT' && (
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

      <Modal
        open={modalOpen}
        title="Would you like to reach out?"
        onClose={() => setModalOpen(false)}
      >
        <p>You told us today isn't a great day. Would you like to contact someone now?</p>
        <div className="modal-actions">
          {favourite && (
            <a
              href={`tel:${favourite.phoneNumber}`}
              className="btn-favourite tap-target"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
              onClick={handleCallFromModal}
            >
              Call {favourite.name} (Favourite)
            </a>
          )}
          {emergency && (
            <a
              href={`tel:${emergency.phoneNumber}`}
              className="btn-emergency tap-target"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
              onClick={handleCallFromModal}
            >
              Call Emergency
            </a>
          )}
          <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
            Not now
          </button>
        </div>
      </Modal>
    </div>
  );
}
