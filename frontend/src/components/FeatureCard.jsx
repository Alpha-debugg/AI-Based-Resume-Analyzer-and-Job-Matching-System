const FeatureCard = ({ icon: Icon, title, description, planned = false }) => {
  return (
    <div className="card relative flex flex-col gap-3 transition-shadow hover:shadow-card-hover">
      {planned && (
        <span className="badge absolute right-4 top-4 bg-amber/10 text-amber-dark">
          Planned
        </span>
      )}
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/10 text-navy">
        <Icon size={20} />
      </span>
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
};

export default FeatureCard;
