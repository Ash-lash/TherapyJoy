import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import Button from '../components/Button';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/game', label: 'Games', icon: 'play' },
  { to: '/videos', label: 'Videos', icon: 'video' },
  { to: '/doctors', label: 'Doctors', icon: 'doctor' },
];

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Responsive icon sizes
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const brandIconSize = isMobile ? 18 : 22;
  const actionIconSize = isMobile ? 16 : 18;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link
          to="/"
          className="navbar-brand"
          onClick={() => setMenuOpen(false)}
          aria-label="TherapyJoy Home"
        >
          <span className="feature-icon" style={{ width: '40px', height: '40px', borderRadius: '12px', minWidth: '40px' }}>
            <Icon name="stethoscope" size={brandIconSize} />
          </span>
          <span style={{ display: 'flex', alignItems: 'center' }}>TherapyJoy</span>
        </Link>

        <nav className="navbar-links" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className="nav-link">
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="btn btn-outline"
            aria-label="Notifications"
            style={{ padding: '8px 10px', minWidth: '40px', minHeight: '40px' }}
            onClick={() => {}}
          >
            <Icon name="bell" size={actionIconSize} />
          </button>

          <button
            type="button"
            className="btn btn-outline"
            aria-label="User profile"
            style={{ padding: '8px 10px', minWidth: '40px', minHeight: '40px' }}
            onClick={() => {}}
          >
            <Icon name="userCircle" size={actionIconSize} />
          </button>

          {currentUser ? (
            <Button
              text="Logout"
              icon="logout"
              variant="ghost"
              onClick={async () => {
                await logout();
                setMenuOpen(false);
              }}
            />
          ) : (
            <Link
              to="/login"
              className="btn btn-outline"
              onClick={() => setMenuOpen(false)}
            >
              <Icon name="arrowRight" size={actionIconSize} />
              <span style={{ display: 'none' }}>Login</span>
            </Link>
          )}

          <button
            type="button"
            className="btn btn-outline hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{ padding: '8px 10px', minWidth: '40px', minHeight: '40px' }}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={actionIconSize} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          <div className="mobile-menu-inner">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </Link>
            ))}

            {currentUser ? (
              <button
                type="button"
                className="nav-link"
                onClick={async () => {
                  await logout();
                  setMenuOpen(false);
                }}
              >
                <Icon name="logout" size={16} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                <Icon name="login" size={18} />
                Login
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
