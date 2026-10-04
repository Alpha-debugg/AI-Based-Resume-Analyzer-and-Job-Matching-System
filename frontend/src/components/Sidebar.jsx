import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanSearch,
  Target,
  History as HistoryIcon,
  User,
  LogOut,
  FileScan,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analyze', label: 'Analyze Resume', icon: ScanSearch },
  { to: '/job-matching', label: 'Job Matching', icon: Target },
  { to: '/history', label: 'History', icon: HistoryIcon },
  { to: '/profile', label: 'Profile', icon: User },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-line bg-white">
      <div className="flex items-center gap-2 px-6 py-6 font-display text-lg font-bold text-navy">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-white">
          <FileScan size={18} />
        </span>
        ResumeIQ
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-navy text-white'
                  : 'text-ink/70 hover:bg-surface hover:text-ink'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
