import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReadAloudButton from '../components/ReadAloudButton.jsx';
import { api } from '../api.js';

/**
 * Home / Dashboard screen 
 * - Reminder card
 * - Three tiles
 * Settings is reachable from the Messages screen contacts management link.
 */
export default function Home() {
  const showReminder =
  localStorage.getItem('wellness.reminders') !== 'off';

  const [name, setName] = useState(null);
  useEffect(() => { api.getProfile().then((p) => p && setName(p.name)); }, []);
  const greeting = name ? `Good Morning, ${name}!` : 'Good Morning!';


  console.log(
  "Reminder setting:",
  localStorage.getItem("wellness.reminders"),
  "showReminder:",
  showReminder
  );
    return (
      <div className="screen">
        <h1>{greeting}</h1>
        <ReadAloudButton text="Good morning. Today's reminder: take medicine at 9 a.m. You can go to Messages, Community, or Wellbeing." />

        {showReminder && (                                 
        <div className="reminder-card">
          <p className="label">Today's Reminder</p>
          <p className="title">9:00am &middot; Take Medicine</p>
        </div>
        )}

        <div className="tile-grid">
          <Link to="/messages" className="tile">
            <span className="icon" aria-hidden="true">💬</span>
            Messages
          </Link>
          <Link to="/community" className="tile">
            <span className="icon" aria-hidden="true">👥</span>
            Community
          </Link>
          <Link to="/wellbeing" className="tile">
            <span className="icon" aria-hidden="true">❤️</span>
            Wellbeing
          </Link>
          <Link to="/settings" className="tile">
          <span className="icon" aria-hidden="true">⚙️</span>
          Settings
          </Link>
        </div>
      </div>
    );
}
