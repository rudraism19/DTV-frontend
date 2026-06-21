import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import SummaryRoutine from './pages/SummaryRoutine';
import GoalsCareer from './pages/GoalsCareer';
import StudyAcademics from './pages/StudyAcademics';
import AIBehavioralProfile from './pages/AIBehavioralProfile';
import SettingsAlerts from './pages/SettingsAlerts';

function App() {
  return (
    <BrowserRouter basename="/parent">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/summary" replace />} />
          <Route path="summary" element={<SummaryRoutine />} />
          <Route path="goals" element={<GoalsCareer />} />
          <Route path="academics" element={<StudyAcademics />} />
          <Route path="behavior" element={<AIBehavioralProfile />} />
          <Route path="settings" element={<SettingsAlerts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
