
import React from 'react';
import { AuditSession } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface AnalyticsDashboardViewProps {
  history: AuditSession[];
}

const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({ history }) => {
  // Mock data for initial empty state
  const mockTrendData = [
    { date: '01/12', score: 15 },
    { date: '05/12', score: 22 },
    { date: '10/12', score: 18 },
    { date: '15/12', score: 35 },
    { date: '20/12', score: 28 },
    { date: '25/12', score: 42 },
    { date: '30/12', score: 25 },
  ];

  const categoryData = [
    { name: 'Mis-selling', count: 12, color: '#ef4444' },
    { name: 'Omission', count: 8, color: '#f59e0b' },
    { name: 'Pressure', count: 4, color: '#3b82f6' },
    { name: 'Unfair Claims', count: 6, color: '#8b5cf6' },
  ];

  const stats = {
    totalAudits: history.length || 124,
    avgScore: history.length ? Math.round(history.reduce((acc, s) => acc + (s.results?.riskScore || 0), 0) / history.length) : 24,
    criticalCases: history.filter(s => (s.results?.riskScore || 0) > 60).length || 3,
    complianceRate: '92%'
  };

  return (
    <div className="w-full max-w-7xl space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">Compliance Analytics</h2>
          <p className="text-blue-200">Across-the-board monitoring of call quality and risks</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/20 hover:bg-white/20 transition-all">Last 30 Days</button>
           <button className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/20 hover:bg-white/20 transition-all">Filter Dept</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Calls Audited', value: stats.totalAudits, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'bg-blue-500' },
          { label: 'Avg Compliance Score', value: stats.avgScore, icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'bg-green-500' },
          { label: 'Critical Violations', value: stats.criticalCases, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'bg-red-500' },
          { label: 'Audit Coverage', value: stats.complianceRate, icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
             <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
             </div>
             <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
             <div className="text-xs font-bold text-blue-200 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl">
          <h3 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
             <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
             Audit Score Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}
                   itemStyle={{fontWeight: 'bold', color: '#1f2937'}}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Bar Chart */}
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl">
          <h3 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
             <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
             Common Violations
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontWeight: 'bold', fontSize: 12}} width={100} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px'}} />
                <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={30}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardView;
