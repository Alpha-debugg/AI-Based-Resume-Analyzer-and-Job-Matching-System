import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Target } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import SkillBadge from '../components/SkillBadge.jsx';
import { getResumes, analyzeMatch } from '../api/api.js';
import { useEffect } from 'react';

const JobMatching = () => {
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(location.state?.resumeId || '');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await getResumes();
        setResumes(data);
        if (!selectedResumeId && data.length > 0) {
          setSelectedResumeId(data[0]._id);
        }
      } catch {
        // no resumes yet, fine for the prototype
      }
    };
    fetchResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMatch = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedResumeId) {
      setError('Please upload and select a resume first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste a job description.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await analyzeMatch({
        resumeId: selectedResumeId,
        jobDescription,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Matching failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Job Matching"
      subtitle="Paste a job description to see how well a resume matches it."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleMatch} className="card space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Select Resume</label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="input-field"
            >
              <option value="" disabled>
                Choose an uploaded resume
              </option>
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.fileName}
                </option>
              ))}
            </select>
            {resumes.length === 0 && (
              <p className="mt-1 text-xs text-muted">
                No resumes found yet &mdash; upload one from the Analyze Resume page first.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Job Description</label>
            <textarea
              rows={10}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here, e.g. required skills: Python, React.js, Node.js, MongoDB, Docker, AWS"
              className="input-field resize-none"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-accent w-full">
            <Target size={18} />
            {loading ? 'Matching...' : 'Match Resume'}
          </button>
        </form>

        <div className="card">
          <h2 className="font-display text-base font-semibold text-ink">Match Result</h2>

          {!result && (
            <p className="mt-4 text-sm text-muted">
              Results will appear here after you run a match.
            </p>
          )}

          {result && (
            <div className="mt-4 space-y-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted">Match Score</p>
                <p className="mt-1 font-display text-4xl font-bold text-navy">
                  {result.matchScore}%
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-ink">Matched Skills</p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.length > 0 ? (
                    result.matchedSkills.map((skill) => (
                      <SkillBadge key={skill} skill={skill} status="matched" />
                    ))
                  ) : (
                    <p className="text-sm text-muted">No matched skills found.</p>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-ink">Missing Skills</p>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.length > 0 ? (
                    result.missingSkills.map((skill) => (
                      <SkillBadge key={skill} skill={skill} status="missing" />
                    ))
                  ) : (
                    <p className="text-sm text-muted">No missing skills &mdash; great fit!</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobMatching;
