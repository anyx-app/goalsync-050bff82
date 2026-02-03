
import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const StatCard = ({ title, value, trend, trendUp, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={cn("p-3 rounded-xl", colorClass)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <button className="text-slate-400 hover:text-slate-600">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm">
      <span className={cn("font-medium", trendUp ? "text-green-600" : "text-red-500")}>
        {trend}
      </span>
      <span className="text-slate-400">vs last month</span>
    </div>
  </div>
);

const GoalItem = ({ title, progress, dueDate, status }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all duration-200 cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
         <svg className="w-full h-full transform -rotate-90">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200" />
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * progress) / 100} className="text-blue-500 transition-all duration-1000 ease-out" />
         </svg>
         <span className="absolute text-xs font-bold text-slate-700">{progress}%</span>
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h4>
        <p className="text-xs text-slate-500">Due {dueDate}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium",
        status === 'On Track' ? "bg-green-100 text-green-700" :
        status === 'At Risk' ? "bg-red-100 text-red-700" :
        "bg-amber-100 text-amber-700"
      )}>
        {status}
      </span>
      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12 text-white shadow-2xl shadow-blue-900/20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Welcome back, Alex! 👋</h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Your team has completed <span className="font-bold text-white">85%</span> of their Q3 goals. 
            The performance review cycle for Q4 is starting in 3 days.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg shadow-black/10">
              View Team Goals
            </button>
            <button className="px-6 py-3 bg-blue-500/30 text-white border border-white/20 rounded-xl font-semibold hover:bg-blue-500/40 backdrop-blur-sm transition-colors">
              Schedule Review
            </button>
          </div>
        </div>
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Goals" 
          value="24" 
          trend="+12%" 
          trendUp={true} 
          icon={Target} 
          colorClass="bg-blue-500"
        />
        <StatCard 
          title="Reviews Pending" 
          value="8" 
          trend="-2" 
          trendUp={true} 
          icon={Clock} 
          colorClass="bg-amber-500"
        />
        <StatCard 
          title="Team Avg Score" 
          value="4.2" 
          trend="+0.3" 
          trendUp={true} 
          icon={TrendingUp} 
          colorClass="bg-green-500"
        />
        <StatCard 
          title="Missed Deadlines" 
          value="3" 
          trend="+1" 
          trendUp={false} 
          icon={AlertCircle} 
          colorClass="bg-red-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Goals Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Active Goals</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 space-y-1">
            <GoalItem title="Increase ARR by 20%" progress={75} dueDate="Sep 30" status="On Track" />
            <GoalItem title="Hire 3 Senior Engineers" progress={40} dueDate="Oct 15" status="Behind" />
            <GoalItem title="Launch Mobile App V2" progress={90} dueDate="Sep 20" status="On Track" />
            <GoalItem title="Complete Security Audit" progress={100} dueDate="Aug 31" status="Completed" />
          </div>
        </div>

        {/* Action Items Column */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold text-slate-800">Action Items</h2>
           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Approve Q3 Goals</h4>
                    <p className="text-xs text-slate-500 mt-1">Sarah & Mike pending approval</p>
                    <button className="mt-2 text-xs font-medium text-blue-600 hover:underline">Review Now</button>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-50" />
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-50" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Self Review Due</h4>
                    <p className="text-xs text-slate-500 mt-1">Cycle: Annual Performance 2024</p>
                    <p className="text-xs text-amber-600 mt-1 font-medium">Due in 2 days</p>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-50" />
                 <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500 ring-4 ring-purple-50" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">New Feedback Request</h4>
                    <p className="text-xs text-slate-500 mt-1">Jane requested peer feedback</p>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
