import { FileScan } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2 font-display font-bold text-navy">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-white">
            <FileScan size={16} />
          </span>
          ResumeIQ
        </div>
        <p className="text-sm text-muted">
          Final-year academic project &mdash; AI-Based Resume Analyzer and Job Matching System.
        </p>
        <p className="text-sm text-muted">&copy; {new Date().getFullYear()} ResumeIQ</p>
      </div>
    </footer>
  );
};

export default Footer;
