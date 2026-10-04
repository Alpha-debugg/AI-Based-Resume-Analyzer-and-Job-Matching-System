import { Link } from 'react-router-dom';
import {
  ScanText,
  Sparkles,
  Gauge,
  Target,
  ListChecks,
  Wand2,
  UploadCloud,
  ArrowDown,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import FeatureCard from '../components/FeatureCard.jsx';

const features = [
  {
    icon: ScanText,
    title: 'Resume Analysis',
    description: 'Upload a PDF resume and get a structured breakdown of its content in seconds.',
  },
  {
    icon: Sparkles,
    title: 'Skill Extraction',
    description: 'Automatically detect technical skills mentioned across the resume.',
  },
  {
    icon: Gauge,
    title: 'ATS Score',
    description: 'A quick score estimate of how well a resume is likely to pass automated screening.',
    planned: true,
  },
  {
    icon: Target,
    title: 'Job Matching',
    description: 'Compare a resume against a job description to see how well they align.',
  },
  {
    icon: ListChecks,
    title: 'Missing Skill Detection',
    description: 'See exactly which required skills are missing from a resume.',
  },
  {
    icon: Wand2,
    title: 'Resume Improvement',
    description: 'Actionable suggestions to strengthen a resume before applying.',
    planned: true,
  },
];

const steps = [
  { label: 'Upload Resume', icon: UploadCloud },
  { label: 'Extract Information', icon: ScanText },
  { label: 'Analyze Skills', icon: Sparkles },
  { label: 'Compare With Job', icon: Target },
  { label: 'Get Results', icon: Gauge },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Hero */}
      <section id="home" className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <span className="badge mb-5 bg-amber/10 text-amber-dark">Final-Year Project Prototype</span>
          <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
            Analyze Your Resume. Find Your Best Job Match.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Upload a resume and let the system extract skills, estimate an ATS score, and
            compare it against a job description &mdash; so you know exactly where you stand.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="btn-accent">
              Analyze Resume
            </Link>
            <a href="#how-it-works" className="btn-outline">
              Learn More
            </a>
          </div>
        </div>

        {/* Illustrative resume-scan panel instead of a generic hero image */}
        <div className="card relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="text-sm font-semibold text-ink">resume_arjun_sharma.pdf</span>
            <span className="badge bg-success/10 text-success">Scanned</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full rounded-full bg-line" />
            <div className="h-2 w-5/6 rounded-full bg-line" />
            <div className="h-2 w-4/6 rounded-full bg-line" />
          </div>
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Detected Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {['Python', 'React.js', 'Node.js', 'MongoDB', 'Git'].map((skill) => (
                <span key={skill} className="badge bg-navy/10 text-navy">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between rounded-xl bg-surface p-4">
            <span className="text-sm text-muted">ATS Score</span>
            <span className="font-display text-xl font-bold text-navy">78 / 100</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 max-w-lg">
            <h2 className="font-display text-3xl font-bold text-ink">
              Everything you need to evaluate a resume
            </h2>
            <p className="mt-3 text-muted">
              Some features are fully working in this prototype; others are shown as
              planned functionality for later phases of the project.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">How It Works</h2>
          <p className="mt-3 text-muted">A simple five-step pipeline, from upload to results.</p>

          <div className="mt-12 flex flex-col items-center gap-3">
            {steps.map((step, index) => (
              <div key={step.label} className="flex flex-col items-center">
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-6 py-3 shadow-card">
                  <step.icon size={18} className="text-navy" />
                  <span className="text-sm font-semibold text-ink">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowDown size={18} className="my-2 text-muted" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
