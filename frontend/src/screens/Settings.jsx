import { useEffect, useState } from 'react';
import { api } from '../api.js';

/**
 * Settings screen - was flagged as empty during informal peer review
 * (Section 5.6, peer feedback point 4: "Settings should have 2-3 options
 * added"). Implements the three options identified in the Design
 * Specification (Section 5.2) response to that feedback:
 *   1. Text size preference (supports DR-2 / WCAG 2.2 resizable text)
 *   2. Notification/reminder preference (supports DR-8 without being
 *      intrusive - user can turn proactive reminders off)
 *   3. Manage emergency/favourite contact (supports DR-9/DR-10 - the user
 *      can see and correct exactly what sensitive contact data is stored)
 */
export default function Settings() {
  const [textSize, setTextSize] = useState(
    () => localStorage.getItem('wellness.textSize') || 'default',
  );
  const [reminders, setReminders] = useState(
    () => localStorage.getItem('wellness.reminders') !== 'off',
  );
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--font-body',
      textSize === 'large' ? '22px' : '18px',
    );
    localStorage.setItem('wellness.textSize', textSize);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('wellness.reminders', reminders ? 'on' : 'off');
  }, [reminders]);

  useEffect(() => {
    api.getContacts().then(setContacts).catch(() => setError('Could not load contacts.'));
  }, []);

  async function removeContact(id) {
    try {
      await api.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError('Could not remove this contact.');
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

      <h2 style={{ fontSize: 'var(--font-body)' }}>Manage contacts</h2>
      <div className="settings-list">
        {contacts.map((c) => (
          <div className="settings-row" key={c.id}>
            <span>{c.name} &middot; {c.role.toLowerCase()}</span>
            <button type="button" className="btn-secondary" style={{ minHeight: 36, padding: '0 12px' }} onClick={() => removeContact(c.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
