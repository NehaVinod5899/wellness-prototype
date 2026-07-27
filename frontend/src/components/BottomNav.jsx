import { NavLink } from 'react-router-dom';

/**
 * Consistent bottom navigation across all four screens (DR-5).
 * Wellbeing is included here as a direct destination - this was missing
 * in Iteration 2/3 (see dissertation Section 5.6, peer feedback point 3)
 * and is fixed in this implementation.
 */
export default function BottomNav() {
  const linkClass = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <NavLink to="/" end className={linkClass}>
        <span aria-hidden="true">🏠</span>
        <span>Home</span>
      </NavLink>
      <NavLink to="/messages" className={linkClass}>
        <span aria-hidden="true">💬</span>
        <span>Messages</span>
      </NavLink>
      <NavLink to="/community" className={linkClass}>
        <span aria-hidden="true">👥</span>
        <span>Community</span>
      </NavLink>
      <NavLink to="/wellbeing" className={linkClass}>
        <span aria-hidden="true">❤️</span>
        <span>Wellbeing</span>
      </NavLink>
    </nav>
  );
}
