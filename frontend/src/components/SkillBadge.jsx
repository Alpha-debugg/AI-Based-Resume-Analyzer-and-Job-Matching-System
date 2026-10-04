import { Check, X } from 'lucide-react';

/**
 * Renders a skill as a small pill badge.
 * status: 'neutral' | 'matched' | 'missing'
 */
const SkillBadge = ({ skill, status = 'neutral' }) => {
  const styles = {
    neutral: 'bg-navy/10 text-navy',
    matched: 'bg-success/10 text-success',
    missing: 'bg-danger/10 text-danger',
  };

  return (
    <span className={`badge ${styles[status]}`}>
      {status === 'matched' && <Check size={12} />}
      {status === 'missing' && <X size={12} />}
      {skill}
    </span>
  );
};

export default SkillBadge;
