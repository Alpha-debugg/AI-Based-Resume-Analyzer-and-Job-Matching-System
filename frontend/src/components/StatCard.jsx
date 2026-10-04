const StatCard = ({ icon: Icon, label, value, accent = 'navy' }) => {
  const accentClasses = {
    navy: 'bg-navy/10 text-navy',
    amber: 'bg-amber/10 text-amber-dark',
    success: 'bg-success/10 text-success',
  };

  return (
    <div className="card flex items-center gap-4">
      <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
        <Icon size={22} />
      </span>
      <div>
        <p className="text-2xl font-bold text-ink">{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
