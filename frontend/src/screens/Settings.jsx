import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { isSpeechSupported } from '../tts.jsx'; 
import ReadAloudButton from '../components/ReadAloudButton.jsx';

/**
 * Settings screen features:
 *   1. Text size preference 
 * 
 *   2. Notification/reminder preference- user can turn proactive reminders off)
 *   3. User can activate audio feature
 *   4. Manage contacts
 */
export default function Settings() {
  const [textSize, setTextSize] = useState(
    () => localStorage.getItem('wellness.textSize') || 'default',
  );
  const [reminders, setReminders] = useState(() => {
  return localStorage.getItem('wellness.reminders') !== 'off';
  });

  useEffect(() => {
    localStorage.setItem('wellness.reminders', reminders ? 'on' : 'off');
  }, [reminders]);
      
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--font-body',
      textSize === 'large' ? '22px' : '18px',
    );
    localStorage.setItem('wellness.textSize', textSize);
  }, [textSize]);

  const [readAloud, setReadAloud] = useState(
  () => localStorage.getItem('wellness.readAloud') === 'on',
  );

  useEffect(() => {
    localStorage.setItem('wellness.readAloud', readAloud ? 'on' : 'off');
  }, [readAloud]);

  const [highContrast, setHighContrast] = useState(
  () => localStorage.getItem('wellness.highContrast') === 'on'
  );

  useEffect(() => {
    localStorage.setItem(
      'wellness.highContrast',
      highContrast ? 'on' : 'off'
    );

    document.body.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  const [profile, setProfile] = useState(null);
  const [pinMode, setPinMode] = useState(null); // null | 'enable' | 'change' | 'disable'
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [newPinConfirmInput, setNewPinConfirmInput] = useState('');
  const [pinError, setPinError] = useState(null);
  const [pinSaving, setPinSaving] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => setError('Could not load profile.'));
  }, []);

  function startPinFlow(mode) {
    setPinMode(mode);
    setCurrentPinInput('');
    setNewPinInput('');
    setNewPinConfirmInput('');
    setPinError(null);
  }

  async function submitPinChange(e) {
    e.preventDefault();
    setPinError(null);
    setPinSaving(true);
    try {
      if (pinMode === 'change' || pinMode === 'disable') {
        const result = await api.verifyPin(currentPinInput);
        if (!result.valid) { setPinError('Current PIN is incorrect.'); setPinSaving(false); return; }
      }
      if (pinMode === 'enable' || pinMode === 'change') {
        if (!/^\d{4}$/.test(newPinInput)) { setPinError('New PIN must be exactly 4 digits.'); setPinSaving(false); return; }
        if (newPinInput !== newPinConfirmInput) { setPinError('New PINs do not match.'); setPinSaving(false); return; }
      }
      const updated = await api.createProfile({
        name: profile.name,
        pinEnabled: pinMode !== 'disable',
        pinCode: pinMode === 'disable' ? null : newPinInput,
      });
      setProfile(updated);
      setPinMode(null);
      setPinSuccess(true);
      setTimeout(() => setPinSuccess(false), 2500);
    } catch {
      setPinError('Could not update PIN settings. Please try again.');
    } finally {
      setPinSaving(false);
    }
  }

  return (
    <div className="screen">
      <h1>Settings</h1>

      {error && <p role="alert">{error}</p>}

      <h2 style={{ fontSize: 'var(--font-body)' }}>Text size</h2>
      <div className="settings-list" style={{ marginBottom: 24 }}>
        <label className="settings-row">
          <span>Standard (18px)</span>
          <input
            type="radio"
            name="textSize"
            checked={textSize === 'default'}
            onChange={() => setTextSize('default')}
          />
        </label>
        <label className="settings-row">
          <span>Large (22px)</span>
          <input
            type="radio"
            name="textSize"
            checked={textSize === 'large'}
            onChange={() => setTextSize('large')}
          />
        </label>
      </div>

      <h2 style={{ fontSize: 'var(--font-body)' }}>Reminders</h2>
      <div className="settings-list" style={{ marginBottom: 24 }}>
        <label className="settings-row">
          <span>Show the daily reminder card on Home</span>
          <input
            type="checkbox"
            checked={reminders}
            onChange={(e) => setReminders(e.target.checked)}
          />
        </label>
      </div>
      <h2 style={{ fontSize: 'var(--font-body)' }}>Read aloud</h2>
      <div className="settings-list" style={{ marginBottom: 24 }}>
        <label className="settings-row">
          <span>Show a "Read aloud" button on each screen</span>
          <input type="checkbox" checked={readAloud} onChange={(e) => setReadAloud(e.target.checked)} disabled={!isSpeechSupported()} />
        </label>
        {!isSpeechSupported() && <p className="secondary-text">Not supported in this browser.</p>}
      </div>
      
      <h2 style={{ fontSize: 'var(--font-body)' }}>
        High Contrast
      </h2>

      <div className="settings-list" style={{ marginBottom: 24 }}>
        <label className="settings-row">
          <span>Enable high contrast mode</span>

          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
          />
        </label>
      </div>

      <h2 style={{ fontSize: 'var(--font-body)' }}>Security</h2>
      <div className="settings-list" style={{ marginBottom: 24 }}>
        {profile && pinMode === null && (
          <>
            <div className="settings-row">
              <span>PIN lock is {profile.pinEnabled ? 'on' : 'off'}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 8 }}>
              {!profile.pinEnabled && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ minHeight: 44 }}
                  onClick={() => startPinFlow('enable')}
                >
                  Turn On PIN
                </button>
              )}
              {profile.pinEnabled && (
                <>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ minHeight: 44 }}
                    onClick={() => startPinFlow('change')}
                  >
                    Change PIN
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ minHeight: 44 }}
                    onClick={() => startPinFlow('disable')}
                  >
                    Turn Off PIN
                  </button>
                </>
              )}
            </div>
            {pinSuccess && (
              <p role="status" style={{ color: 'var(--color-positive)' }}>&#10003; Updated</p>
            )}
          </>
        )}

        {pinMode !== null && (
          <form onSubmit={submitPinChange} className="compose-form">
            {(pinMode === 'change' || pinMode === 'disable') && (
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="Current PIN"
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, ''))}
                required
              />
            )}
            {(pinMode === 'enable' || pinMode === 'change') && (
              <>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="New 4-digit PIN"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="Confirm new PIN"
                  value={newPinConfirmInput}
                  onChange={(e) => setNewPinConfirmInput(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </>
            )}
            {pinError && <p role="alert" style={{ color: 'var(--color-negative)' }}>{pinError}</p>}
            <button type="submit" className="btn-primary" style={{ minHeight: 44 }} disabled={pinSaving}>
              {pinSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ minHeight: 44 }}
              onClick={() => setPinMode(null)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
    
  );
}
