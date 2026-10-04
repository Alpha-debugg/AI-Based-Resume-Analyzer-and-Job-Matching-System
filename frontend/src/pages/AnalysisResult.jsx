import { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Target } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import SkillBadge from '../components/SkillBadge.jsx';
import { getResumeById } from '../api/api.js';

// Sample project entries shown for Review 2 -- real project detection from
// resume text is a later-phase feature.
const sampleProjects = [
  { name: 'E-commerce Web App', stack: 'React.js, Node.js, MongoDB' },
  { name: 'Portfolio Website', stack: 'HTML, CSS, JavaScript' },
];

const AnalysisResult = () => {
  const { resumeId } = useParams();
  const location = useLocation();
  const [resume, setResume] = useState(location.state?.result?.resume || null);
  const [atsScore, setAtsScore] = useState(location.state?.result?.analysis?.atsScore || 78);
  const [textExpanded, setTextExpanded] = useState(false);

  useEffect(() => {
    if (!resume) {
      const fetchResume = async () => {
        try {
          const { data } = await getResumeById(resumeId);
          setResume(data);
        } catch {
          // If the fetch fails, the page simply shows nothing to parse --
          // acceptable for the Review 2 prototype.
        }
      };
      fetchResume();
    }
  }, [resumeId, resume]);

  if (!resume) {
    return (
      <DashboardLayout title="Analysis Result">
        <p className="text-muted">Loading resume analysis...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analysis Result" subtitle={resume.fileName}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Resume Information */}
          <div className="card">
            <h2 className="font-display text-base font-semibold text-ink">Resume Information</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted">Name</dt>
                <dd className="font-medium text-ink">Detected from resume text</dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="font-medium text-ink">Detected from resume text</dd>
              </div>
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="font-medium text-ink">Detected from resume text</dd>
              </div>
              <div>
                <dt className="text-muted">Education</dt>
                <dd className="font-medium text-ink">Detected from resume text</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted">
              Structured contact/education extraction is planned for a later phase. This prototype focuses on skill extraction.
            </p>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 className="font-display text-base font-semibold text-ink">Extracted Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {resume.skills && resume.skills.length > 0 ? (
                resume.skills.map((skill) => <SkillBadge key={skill} skill={skill} />)
              ) : (
                <p className="text-sm text-muted">No known skills were detected in this resume.</p>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="card">
            <h2 className="font-display text-base font-semibold text-ink">Projects</h2>
            <p className="mt-1 text-xs text-muted">Sample entries shown for this prototype.</p>
            <div className="mt-4 space-y-3">
              {sampleProjects.map((project) => (
                <div key={project.name} className="rounded-xl border border-line p-4">
                  <p className="text-sm font-medium text-ink">{project.name}</p>
                  <p className="text-xs text-muted">{project.stack}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted text */}
          <div className="card">
            <button
              onClick={() => setTextExpanded(!textExpanded)}
              className="flex w-full items-center justify-between text-left"
            >
              <h2 className="font-display text-base font-semibold text-ink">Extracted Text</h2>
              {textExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {textExpanded && (
              <p className="mt-4 max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl bg-surface p-4 text-sm text-muted">
                {resume.extractedText || 'No text was extracted from this resume.'}
              </p>
            )}
          </div>
        </div>

        {/* ATS Score + CTA */}
        <div className="space-y-6">
          <div className="card text-center">
            <p className="text-sm font-medium text-muted">ATS Score</p>
            <p className="mt-2 font-display text-4xl font-bold text-navy">{atsScore}/100</p>
            <p className="mt-2 text-xs text-muted">
              Demo placeholder score. A real scoring algorithm is planned for a later phase.
            </p>
          </div>

          <Link to="/job-matching" state={{ resumeId: resume._id || resume.id }} className="btn-accent w-full">
            <Target size={18} />
            Match Against a Job
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalysisResult;
