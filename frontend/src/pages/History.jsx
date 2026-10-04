import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { getResumes } from '../api/api.js';

const History = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await getResumes();
        setResumes(data);
      } catch {
        setResumes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  return (
    <DashboardLayout title="History" subtitle="All resumes you've uploaded and analyzed.">
      {loading && <p className="text-sm text-muted">Loading history...</p>}

      {!loading && resumes.length === 0 && (
        <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/10 text-navy">
            <FileText size={22} />
          </span>
          <p className="text-sm font-medium text-ink">No resumes analyzed yet</p>
          <p className="max-w-xs text-sm text-muted">
            Upload your first resume to see its analysis history here.
          </p>
          <Link to="/analyze" className="btn-primary mt-2">
            Analyze Resume
          </Link>
        </div>
      )}

      {!loading && resumes.length > 0 && (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="px-6 py-3 font-medium">File Name</th>
                <th className="px-6 py-3 font-medium">Skills Detected</th>
                <th className="px-6 py-3 font-medium">Uploaded</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((r) => (
                <tr key={r._id} className="border-b border-line last:border-0">
                  <td className="px-6 py-4 font-medium text-ink">{r.fileName}</td>
                  <td className="px-6 py-4 text-muted">{r.skills?.length || 0} skills</td>
                  <td className="px-6 py-4 text-muted">
                    {new Date(r.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/analyze/result/${r._id}`} className="text-sm font-semibold text-navy">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default History;
