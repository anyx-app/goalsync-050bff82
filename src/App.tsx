
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/goals" element={<div className="p-10 text-center text-slate-500">Goals Module Coming Soon</div>} />
        <Route path="/reviews" element={<div className="p-10 text-center text-slate-500">Reviews Module Coming Soon</div>} />
        <Route path="/team" element={<div className="p-10 text-center text-slate-500">Team Module Coming Soon</div>} />
        <Route path="/feedback" element={<div className="p-10 text-center text-slate-500">Feedback Module Coming Soon</div>} />
        <Route path="/settings" element={<div className="p-10 text-center text-slate-500">Settings Module Coming Soon</div>} />
        <Route path="*" element={<div className="p-10 text-center text-slate-500">404 - Page Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
