import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
const Login = lazy(() => import('./pages/Login'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const SummaryRoutine = lazy(() => import('./pages/SummaryRoutine'));
const GoalsCareer = lazy(() => import('./pages/GoalsCareer'));
const StudyAcademics = lazy(() => import('./pages/StudyAcademics'));
const AIBehavioralProfile = lazy(() => import('./pages/AIBehavioralProfile'));
const SettingsAlerts = lazy(() => import('./pages/SettingsAlerts'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter basename="/parent">
      <Suspense fallback={<PageLoader />}>
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
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
