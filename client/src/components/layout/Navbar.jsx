import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-3">
      <div className="flex items-center gap-6">
        <span className="text-lg font-bold text-indigo-600">TaskFlow</span>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-sm font-medium text-gray-600 hover:text-indigo-600"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{user?.fullName}</span>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}