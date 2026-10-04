import Sidebar from './Sidebar.jsx';

const DashboardLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 px-6 py-8 md:px-10">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
            )}
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
