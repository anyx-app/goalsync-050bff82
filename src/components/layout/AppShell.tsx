
import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Calendar, 
  Users, 
  Settings, 
  Menu, 
  Bell, 
  Search,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, to, onClick }: SidebarItemProps) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
          isActive 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        )
      }
    >
      <Icon className="w-5 h-5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </NavLink>
  );
};

export default function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/goals')) return 'Goals';
    if (path.startsWith('/reviews')) return 'Reviews';
    if (path.startsWith('/team')) return 'Team Overview';
    if (path.startsWith('/feedback')) return '360 Feedback';
    return 'GoalSync';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200 shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-slate-100">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                  <span className="mt-0.5">G</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">GoalSync</h1>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Enterprise</p>
                </div>
             </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">Platform</div>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem icon={Target} label="My Goals" to="/goals" onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem icon={Calendar} label="Reviews" to="/reviews" onClick={() => setIsSidebarOpen(false)} />
            
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3 mt-8">Management</div>
            <SidebarItem icon={Users} label="Team Overview" to="/team" onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem icon={Users} label="360 Feedback" to="/feedback" onClick={() => setIsSidebarOpen(false)} />
            
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3 mt-8">System</div>
            <SidebarItem icon={Settings} label="Settings" to="/settings" onClick={() => setIsSidebarOpen(false)} />
          </nav>

          {/* User Profile Snippet */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-300 to-amber-500 border-2 border-white shadow-sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">Alex Manager</p>
                <p className="text-xs text-slate-500 truncate">alex@goalsync.com</p>
              </div>
              <LogOut className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-slate-800 hidden sm:block">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100/50 rounded-lg border border-slate-200/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400 text-slate-700"
              />
            </div>
            <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
