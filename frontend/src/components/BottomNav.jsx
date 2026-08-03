import { NavLink } from 'react-router-dom';

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
