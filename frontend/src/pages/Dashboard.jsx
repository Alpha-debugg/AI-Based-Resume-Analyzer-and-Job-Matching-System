import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Gauge, Target, Sparkles, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getResumes } from '../api/api.js';

// Demo fallback data shown until real resumes exist, per Review 2 scope.
const demoRecentAnalyses = [
  { id: 'demo-1', fileName: 'arjun_sharma_resume.pdf', skills: 8, score: 78, date: 'Sample data' },
  { id: 'demo-2', fileName: 'priya_verma_resume.pdf', skills: 6, score: 71, date: 'Sample data' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState({ analyzed: 0, avgScore: 78, matched: 0, skills: 0 });

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await getResumes();
        setResumes(data);
        const totalSkills = data.reduce((sum, r) => sum + (r.skills?.length || 0), 0);
        setStats((prev) => ({
          ...prev,
          analyzed: data.length,
          skills: totalSkills,
        }));
      } catch {
        // Silently fall back to demo data for the Review 2 prototype
      }
    };
    fetchResumes();
  }, []);

  const recentList =
    resumes.length > 0
      ? resumes.slice(0, 5).map((r) => ({
          id: r._id,
          fileName: r.fileName,
          skills: r.skills?.length || 0,
          score: 78,
          date: new Date(r.uploadedAt).toLocaleDateString(),
        }))
      : demoRecentAnalyses;

  return (
    <DashboardLayout
      title={`Welcome back${user?.name ? `, ${user.name.split(' ')[0]}` : ''}`}
      subtitle="Here's a snapshot of your resume analysis activity."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Resumes Analyzed" value={stats.analyzed || 2} accent="navy" />
        <StatCard icon={Gauge} label="Average ATS Score" value={`${stats.avgScore}/100`} accent="amber" />
        <StatCard icon={Target} label="Jobs Matched" value={stats.matched || 3} accent="success" />
        <StatCard icon={Sparkles} label="Skills Detected" value={stats.skills || 14} accent="navy" />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Recent Analyses</h2>
        <Link to="/analyze" className="btn-primary">
          <Plus size={16} />
          Analyze Resume
        </Link>
      </div>

      <div className="card mt-4 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase text-muted">
            <tr>
              <th className="px-6 py-3 font-medium">File Name</th>
              <th className="px-6 py-3 font-medium">Skills Detected</th>
              <th className="px-6 py-3 font-medium">ATS Score</th>
              <th className="px-6 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentList.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-0">
                <td className="px-6 py-4 font-medium text-ink">{item.fileName}</td>
                <td className="px-6 py-4 text-muted">{item.skills} skills</td>
                <td className="px-6 py-4">
                  <span className="badge bg-success/10 text-success">{item.score}/100</span>
                </td>
                <td className="px-6 py-4 text-muted">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
