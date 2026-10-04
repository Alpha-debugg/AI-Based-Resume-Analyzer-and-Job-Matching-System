import { User, Mail, Calendar } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Profile" subtitle="Your account details.">
      <div className="max-w-lg">
        <div className="card flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy/10 text-navy">
            <User size={28} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-ink">
              {user?.name || 'Student User'}
            </p>
            <p className="text-sm text-muted">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <div className="card mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-muted" />
            <div>
              <p className="text-xs text-muted">Email</p>
              <p className="text-sm font-medium text-ink">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-muted" />
            <div>
              <p className="text-xs text-muted">Account Created</p>
              <p className="text-sm font-medium text-ink">Available once the backend is connected</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted">
          Profile editing and password change are planned for a later phase of this project.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
