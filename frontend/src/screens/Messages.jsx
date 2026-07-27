import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

/**
 * Messages screen (Section 5.4).
 * - One-tap call per contact, no text thread required (DR-4, DR-7;
 *   directly answers the WhatsApp typing-burden limitation, Section 3.3.1).
 * - "Voice message" / "New message" are UI shortcuts only in this
 *   prototype: there is no messaging backend, since Section 5.2 (Design
 *   Specification, "Prototype scope") explicitly excludes real messaging
 *   infrastructure. They are left as clearly-labelled, disabled affordances
 *   rather than removed, so the full feature set from Section 5.4 remains
 *   visible in the implementation.
 */
export default function Messages() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getContacts().then(setContacts).catch(() => setError('Could not load contacts.'));
  }, []);

  return (
    <div className="screen">
      <h1>Messages</h1>

      {error && <p role="alert">{error}</p>}

      {contacts.map((contact) => (
        <div className="contact-row" key={contact.id}>
          <div className="avatar" aria-hidden="true">
            {contact.name.charAt(0)}
          </div>
          <div className="name">{contact.name}</div>
          <a
            href={`tel:${contact.phoneNumber}`}
            className="call-btn tap-target"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
            aria-label={`Call ${contact.name}`}
          >
            📞
          </a>
        </div>
      ))}

      <div className="shortcut-row">
        <button type="button" className="btn-secondary" disabled title="Not available in this prototype">
          🎙️ Voice Message
        </button>
        <button type="button" className="btn-secondary" disabled title="Not available in this prototype">
          ✏️ New Message
        </button>
      </div>

      <p className="secondary-text" style={{ marginTop: 24 }}>
        <Link to="/settings">Manage contacts &rarr;</Link>
      </p>
    </div>
  );
}
