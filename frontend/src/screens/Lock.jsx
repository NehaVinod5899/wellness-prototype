import { useState } from 'react';
import { api } from '../api.js';

/**
 * Shown when the profile has pinEnabled=true and this browser session
 * hasn't been unlocked yet . Uses sessionStorage, not
 * localStorage, deliberately - it re-locks on every new browser session
 * (closing and reopening), rather than staying permanently unlocked on
 * a shared or borrowed device.
 */
export default function Lock({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setChecking(true);
    try {
      const result = await api.verifyPin(pin);
      if (result.valid) {
        sessionStorage.setItem('wellness.unlocked', 'true');
        onUnlock();
      } else {
        setError('Incorrect PIN. Please try again.');
        setPin('');
      }
    } catch {
      setError('Could not check your PIN. Please try again.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="screen">
      <h1>Enter your PIN</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          autoFocus
          placeholder="4-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          className="setup-input"
        />
        {error && <p role="alert" style={{ color: 'var(--color-negative)', marginTop: 12 }}>{error}</p>}
        <button
          type="submit"
          className="btn-primary"
          disabled={pin.length !== 4 || checking}
          style={{ marginTop: 16 }}
        >
          {checking ? 'Checking...' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}