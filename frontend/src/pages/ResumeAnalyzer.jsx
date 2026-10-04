import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanSearch } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import FileUpload from '../components/FileUpload.jsx';
import { uploadResume } from '../api/api.js';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file) return;
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await uploadResume(formData);
      navigate(`/analyze/result/${data.resume.id}`, { state: { result: data } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Something went wrong while analyzing the resume. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Analyze Resume"
      subtitle="Upload a PDF resume to extract skills and get an ATS score estimate."
    >
      <div className="mx-auto max-w-2xl">
        <FileUpload
          file={file}
          onFileSelect={setFile}
          onFileRemove={() => setFile(null)}
        />

        {error && (
          <div className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="btn-accent mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ScanSearch size={18} />
          {loading ? 'Analyzing Resume...' : 'Analyze Resume'}
        </button>

        <p className="mt-4 text-center text-xs text-muted">
          Your resume is processed locally by the Python parser and never shared externally.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalyzer;
