import { useState } from 'react';
import { api } from '../api.js';

/**
 * It follows the "device is the identity" pattern
 *- a name for personalisation, an optional PIN
 * for a lightweight unlock, and - critically - at least one contact,
 */
export default function Setup({ onComplete }) {
  const [step, setStep] = useState(1); // 1: name, 2: first contact, 3: PIN, 4: saving
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleFinish() {
    setError(null);

    if (pinEnabled) {
      if (!/^\d{4}$/.test(pin)) {
        setError('PIN must be exactly 4 digits.');
        return;
      }
      if (pin !== pinConfirm) {
        setError('PINs do not match.');
        return;
      }
    }

    setSaving(true);
    try {
      // 1. Create the first contact as FAVOURITE, so Wellbeing escalation
      //    works immediately after setup finishes.
      await api.createContact({ name: contactName, phoneNumber: contactPhone, role: 'FAVOURITE' });

      // 2. Create the profile (name + optional PIN).
      await api.createProfile({ name, pinEnabled, pinCode: pinEnabled ? pin : null });

      onComplete();
    } catch {
      setError('Something went wrong finishing setup. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div className="screen">
      <h1>Welcome</h1>

      {step === 1 && (
        <>
          <p className="secondary-text" style={{ marginBottom: 16 }}>
            Let's set a few things up. What's your name?
          </p>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="setup-input"
          />
          <button
            type="button"
            className="btn-primary"
            disabled={!name.trim()}
            onClick={() => setStep(2)}
            style={{ marginTop: 16 }}
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="secondary-text" style={{ marginBottom: 16 }}>
            Add someone you'd want to reach out to on a difficult day. This will be your
            favourite contact.
          </p>
          <input
            type="text"
            placeholder="Their name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="setup-input"
          />
          <input
            type="tel"
            placeholder="Their phone number"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="setup-input"
            style={{ marginTop: 8 }}
          />
          <button
            type="button"
            className="btn-primary"
            disabled={!contactName.trim() || !contactPhone.trim()}
            onClick={() => setStep(3)}
            style={{ marginTop: 16 }}
          >
            Next
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <p className="secondary-text" style={{ marginBottom: 16 }}>
            Would you like to protect the app with a 4-digit PIN? This is optional.
          </p>
          <label className="settings-row" style={{ marginBottom: 16 }}>
            <span>Use a PIN</span>
            <input
              type="checkbox"
              checked={pinEnabled}
              onChange={(e) => setPinEnabled(e.target.checked)}
            />
          </label>

          {pinEnabled && (
            <>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="Enter a 4-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="setup-input"
              />
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="Confirm PIN"
                value={pinConfirm}
                onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ''))}
                className="setup-input"
                style={{ marginTop: 8 }}
              />
            </>
          )}

          {error && <p role="alert" style={{ color: 'var(--color-negative)', marginTop: 12 }}>{error}</p>}

          <button
            type="button"
            className="btn-primary"
            disabled={saving}
            onClick={handleFinish}
            style={{ marginTop: 16 }}
          >
            {saving ? 'Setting up...' : 'Finish Setup'}
          </button>
        </>
      )}
    </div>
  );
}