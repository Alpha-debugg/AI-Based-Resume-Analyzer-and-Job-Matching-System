import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ResumeAnalyzer from './pages/ResumeAnalyzer.jsx';
import AnalysisResult from './pages/AnalysisResult.jsx';
import JobMatching from './pages/JobMatching.jsx';
import History from './pages/History.jsx';
import Profile from './pages/Profile.jsx';
import PrivateRoute from './utils/PrivateRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/analyze"
        element={
          <PrivateRoute>
            <ResumeAnalyzer />
          </PrivateRoute>
        }
      />
      <Route
        path="/analyze/result/:resumeId"
        element={
          <PrivateRoute>
            <AnalysisResult />
          </PrivateRoute>
        }
      />
      <Route
        path="/job-matching"
        element={
          <PrivateRoute>
            <JobMatching />
          </PrivateRoute>
        }
      />
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
