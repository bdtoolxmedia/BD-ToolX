import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Globe, Smartphone, Monitor, MousePointer2, 
  TrendingUp, Zap, Clock, Map as MapIcon,
  ArrowUpRight, ArrowDownRight, Activity,
  Trophy, Filter, RefreshCw
} from 'lucide-react';
import { analyticsMonitor } from '../analytics';

const trafficData = [
  { name: 'US', value: 4500, color: '#4f46e5' },
  { name: 'BD', value: 3200, color: '#10b981' },
  { name: 'IN', value: 2100, color: '#f59e0b' },
  { name: 'UK', value: 1800, color: '#ec4899' },
  { name: 'DE', value: 1200, color: '#6366f1' },
];

const deviceData = [
  { name: 'Mobile', value: 75, color: '#4f46e5' },
  { name: 'Desktop', value: 20, color: '#10b981' },
  { name: 'Tablet', value: 5, color: '#f59e0b' },
];

const timelineData = [
  { time: '00:00', hits: 120 }, { time: '04:00', hits: 80 },
  { time: '08:00', hits: 450 }, { time: '12:00', hits: 890 },
  { time: '16:00', hits: 1200 }, { time: '20:00', hits: 950 },
];

const Analytics: React.FC = () => {
  const performanceMatrix = useMemo(() => analyticsMonitor.getPlatformPerformance(), []);
  const bestPlatforms = useMemo(() => analyticsMonitor.getBestPerformingPlatforms(), []);
  const recentLogs = useMemo(() => analyticsMonitor.getRecentLogs(5), []);

  const matrixData = Object.entries(performanceMatrix).map(([name, data]: [string, any]) => ({
    name,
    clicks: data.totalClicks,
    dists: data.distributions
  }));

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Intelligence Node</h1>
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] mt-3">Global Traffic Synapse • Real-time Monitoring</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Live Stream Active</span>
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Global Hits', value: '142,890', trend: '+12.5%', up: true, icon: <Activity size={20} /> },
          { label: 'Unique Nodes', value: '89,432', trend: '+8.2%', up: true, icon: <Globe size={20} /> },
          { label: 'Bounce Rate', value: '24.2%', trend: '-2.1%', up: true, icon: <MousePointer2 size={20} /> },
          { label: 'Avg Session', value: '4m 32s', trend: '+15.4%', up: true, icon: <Clock size={20} /> }
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {s.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${s.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {s.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tighter">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Platform Yield Matrix - NEW Section from src/analytics.ts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-slate-900 rounded-[4rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <Trophy size={160} />
          </div>
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-600 rounded-2xl">
                <Trophy size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Platform Yield Matrix</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live Shortlink Efficiency Log</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <RefreshCw size={14} className="text-indigo-400 animate-spin-slow" />
              <span className="text-[9px] font-black uppercase tracking-widest">Real-time Sync</span>
            </div>
          </div>

          <div className="h-80 w-full relative z-10">
            {matrixData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={matrixData}>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#ffffff10" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                  />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '16px', color: 'white' }}
                  />
                  <Bar dataKey="clicks" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="dists" fill="#10b981" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                <Filter size={48} />
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting First Distribution Data</p>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
             {bestPlatforms.slice(0, 3).map((plat, idx) => (
               <div key={plat} className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center font-black">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Top Performer</p>
                    <h4 className="text-sm font-black uppercase tracking-tighter">{plat}</h4>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white rounded-[4rem] border border-slate-100 p-10 shadow-2xl space-y-8">
           <div className="flex items-center gap-3 text-slate-400 mb-2">
             <Clock size={18} />
             <h3 className="text-[11px] font-black uppercase tracking-widest">Neural Link Stream</h3>
           </div>
           <div className="space-y-4">
              {recentLogs.length > 0 ? recentLogs.map((log: any, i: number) => (
                <div key={i} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:bg-indigo-50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                         <Zap size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-[11px] font-black uppercase truncate max-w-[120px]">{log.platform}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[120px]">{log.shortUrl}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] font-black text-slate-900">{log.clicks} hits</div>
                      <div className="text-[8px] font-bold text-slate-300 uppercase">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                   </div>
                </div>
              )) : (
                <div className="py-20 text-center opacity-20 italic text-xs font-bold">No Neural Logs Synchronized</div>
              )}
           </div>
           <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all">
             Audit Global Trace
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Traffic Velocity */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
              <Zap size={24} className="text-indigo-600" fill="currentColor" />
              Traffic Velocity
            </h3>
            <select className="bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase px-4 py-2 outline-none">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 900}}
                />
                <Line type="monotone" dataKey="hits" stroke="#4f46e5" strokeWidth={4} dot={{r: 6, fill: '#4f46e5'}} activeDot={{r: 8, strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-2xl">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-10">Device Nodes</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-black text-slate-900">75%</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile</span>
            </div>
          </div>
          <div className="space-y-4 mt-8">
            {deviceData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{d.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
