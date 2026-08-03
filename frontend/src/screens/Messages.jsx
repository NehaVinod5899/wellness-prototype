import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';
import ReadAloudButton from '../components/ReadAloudButton.jsx';

/**
 *  Message is backed by the Message entity/API - persisted, so
 *   history survives a refresh or restart.
 * - "Voice Message" remains a static, frontend-only mock 
 */

export default function Messages() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [voiceMessages] = useState([
    { id: 1, contactName: 'Sarah', duration: '0:32' },
    { id: 2, contactName: 'Emma', duration: '1:04' },
   ]);
  const [showMessages, setShowMessages] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [newText, setNewText] = useState('');
  const [newContactId, setNewContactId] = useState('');

  const [showAddContact, setShowAddContact] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [addError, setAddError] = useState(null);
  const [contactPendingDelete, setContactPendingDelete] = useState(null);

  useEffect(() => {
    api.getContacts().then(setContacts).catch(() => setError('Could not load contacts.'));
    refreshMessages();
  }, []);

  function refreshMessages() {
    api.getMessages().then(setMessages).catch(() => setError('Could not load messages.'));
  }

  function requestDeleteContact(contact) {
    setContactPendingDelete(contact);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!newText.trim() || !newContactId) return;
    try {
      await api.sendMessage(Number(newContactId), newText);
      setNewText('');
      refreshMessages();
    } catch {
      setError('Could not send message. Please try again.');
    }
  }
  async function handleAddContact(e) {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    try {
      const created = await api.createContact({ name: newName, phoneNumber: newPhone, role: 'REGULAR' });
      setContacts((prev) => [...prev, created]);
      setNewName('');
      setNewPhone('');
      setAddError(null);
    } catch {
      setAddError('Could not add contact. Check the details and try again.');
    }
  }

  async function handleSetFavourite(contact) {
    try {
      const previousFavourite = contacts.find((c) => c.role === 'FAVOURITE' && c.id !== contact.id);
      if (previousFavourite) {
        await api.updateContact(previousFavourite.id, { ...previousFavourite, role: 'REGULAR' });
      }
      await api.updateContact(contact.id, { ...contact, role: 'FAVOURITE' });
      setContacts(await api.getContacts());
    } catch {
      setError('Could not update favourite contact.');
    }
  }

  async function confirmDeleteContact() {
    const contact = contactPendingDelete;
    setContactPendingDelete(null);
    if (!contact) return;
    try {
      await api.deleteContact(contact.id);
      setContacts((prev) => prev.filter((c) => c.id !== contact.id));
    } catch {
      setError('Could not remove this contact.');
    }
  }

  return (
  <div className="screen">
    <h1>Messages</h1>
    <ReadAloudButton
      text={
        messages.length
          ? `You have ${messages.length} message${messages.length === 1 ? '' : 's'}. ${messages
              .slice(0, 5)
              .map((m) => `${m.contactName} says: ${m.text}`)
              .join('. ')}`
          : 'Messages. No messages yet.'
      }
    />

    {error && <p role="alert">{error}</p>}

    {contacts.map((contact) => (
      <div className="contact-row" key={contact.id}>
        <div className="name">
          {contact.name}
        </div>
        <button
          type="button"
          className="favourite-btn tap-target"
          onClick={() => handleSetFavourite(contact)}
          disabled={contact.role === 'FAVOURITE'}
          aria-label={contact.role === 'FAVOURITE' ? `${contact.name} is your favourite contact` : `Set ${contact.name} as favourite contact`}
        >
          {contact.role === 'FAVOURITE' ? '⭐' : '☆'}
        </button>

        <a
          href={`tel:${contact.phoneNumber}`}
          className="call-btn tap-target"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
          }}
          aria-label={`Call ${contact.name}`}
        >
          📞
        </a>
        <button
          type="button"
          className="delete-btn tap-target"
          // onClick={() => handleDeleteContact(contact)}
          onClick={() => requestDeleteContact(contact)}
          aria-label={`Remove ${contact.name} from contacts`}
        >
          🗑️
        </button>
      </div>
      
    ))}

    <div className="shortcut-row">
      <button
        type="button"
        className="btn-secondary"
        onClick={() => setShowVoice((v) => !v)}
      >
        🎙️ Voice Message
      </button>

      <button
        type="button"
        className="btn-secondary"
        onClick={() => setShowMessages((v) => !v)}
      >
        ✏️ New Message
      </button>
      <button type="button" className="btn-secondary" onClick={() => setShowAddContact((v) => !v)}>
        ➕ Add Contact
      </button>
    </div>
    
    {showAddContact && (
      <div className="message-panel">
        {addError && <p role="alert">{addError}</p>}
        <form onSubmit={handleAddContact} className="compose-form">
          <input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
          <input type="tel" placeholder="Phone number" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
          <button type="submit" className="btn-primary" style={{ minHeight: 44 }}>Add Contact</button>
        </form>
      </div>
    )}
    {showVoice && (
      <div className="message-panel">
        <p className="secondary-text" style={{ marginBottom: 8 }}>
          Voice messages (demo only &mdash; not saved)
        </p>

        {voiceMessages.map((vm) => (
          <div className="voice-message-row" key={vm.id}>
            <span>🎙️ {vm.contactName}</span>
            <span className="secondary-text">{vm.duration}</span>
          </div>
        ))}
      </div>
    )}

    {showMessages && (
      <div className="message-panel">
        <form onSubmit={handleSend} className="compose-form">
          <select
            value={newContactId}
            onChange={(e) => setNewContactId(e.target.value)}
            required
          >
            <option value="">Send to...</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Type a message"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />

          <button
            type="submit"
            className="btn-primary"
            style={{ minHeight: 44 }}
          >
            Send
          </button>
        </form>

        <p
          className="secondary-text"
          style={{ marginTop: 16, marginBottom: 8 }}
        >
          Recent messages
        </p>

        {messages.map((m) => (
          <div className="message-row" key={m.id}>
            <span className="name">{m.contactName}</span>
            <span>{m.text}</span>
            <span className="secondary-text">
              {new Date(m.sentAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )}
    <Modal
      open={!!contactPendingDelete}
      title="Remove this contact?"
      onClose={() => setContactPendingDelete(null)}
    >
      <p>
        {contactPendingDelete
          ? `Remove ${contactPendingDelete.name} from your contacts? This can't be undone.`
          : ''}
      </p>
      <div className="modal-actions">
        <button type="button" className="btn-emergency" onClick={confirmDeleteContact}>
          Remove
        </button>
        <button type="button" className="btn-secondary" onClick={() => setContactPendingDelete(null)}>
          Cancel
        </button>
      </div>
    </Modal>
  </div>
);
}