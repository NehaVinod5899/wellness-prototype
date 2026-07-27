import { Link } from 'react-router-dom';

/**
 * Home / Dashboard screen (Section 5.4).
 * - Reminder card: DR-8 proactive engagement, surfaced without navigation.
 * - Three tiles: DR-1 integration (single entry point to all domains).
 * Settings is intentionally not a fourth tile here - it lives in the bottom
 * nav's overflow via Community > ... in a larger build; for this prototype
 * it is reachable from the Messages screen contacts management link.
 */
export default function Home() {
  return (
    <div className="screen">
      <h1>Good Morning!</h1>

      <div className="reminder-card">
        <p className="label">Today's Reminder</p>
        <p className="title">9:00am &middot; Take Medicine</p>
      </div>

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
      </div>
    </div>
  );
}
