import React, { useState, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  Users, Send, DollarSign, TrendingUp, Sparkles, 
  Globe, MousePointer2, Search, CheckCircle2, AlertCircle, Info, Link as LinkIcon,
  Layout, Activity, Zap, BarChart, Network
} from 'lucide-react';
import { analyzePerformance } from '../services/geminiService';
import LinktreeDashboard from '../components/LinktreeDashboard';
import { autoDistributor } from '../auto-distributor';

const data = [
  { name: 'Mon', revenue: 400, posts: 24, clicks: 2400, visitors: 1200, impressions: 4500 },
  { name: 'Tue', revenue: 300, posts: 13, clicks: 2210, visitors: 1100, impressions: 4800 },
  { name: 'Wed', revenue: 980, posts: 32, clicks: 2290, visitors: 1900, impressions: 5200 },
  { name: 'Thu', revenue: 390, posts: 20, clicks: 2000, visitors: 1400, impressions: 5000 },
  { name: 'Fri', revenue: 480, posts: 25, clicks: 2181, visitors: 1600, impressions: 5600 },
  { name: 'Sat', revenue: 1100, posts: 45, clicks: 2500, visitors: 2200, impressions: 6100 },
  { name: 'Sun', revenue: 1300, posts: 50, clicks: 2100, visitors: 2500, impressions: 6800 },
];

const Dashboard: React.FC = () => {
  const [aiInsight, setAiInsight] = React.useState<string>("");
  const [loadingInsight, setLoadingInsight] = React.useState(false);
  const [view, setView] = useState<'analytics' | 'linktree'>('linktree');

  const distributionReport = useMemo(() => autoDistributor.getDistributionReport(), []);

  const getAiInsight = async () => {
    setAiInsight("");
    setLoadingInsight(true);
    const insight = await analyzePerformance(data);
    setAiInsight(insight);
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-4">
            Command Center {view === 'linktree' ? <LinkIcon className="text-indigo-600" /> : <Activity className="text-blue-600" />}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-2">
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black border border-emerald-100 shadow-sm">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               NODE ONLINE
             </div>
             <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
               Core Instance: <span className="text-slate-900">BDToolX_v2.9</span>
             </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-slate-200/50 rounded-2xl shadow-inner border border-slate-200">
          <button 
            onClick={() => setView('linktree')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'linktree' ? 'bg-white text-slate-900 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Layout size={16} /> Linktree Build
          </button>
          <button 
            onClick={() => setView('analytics')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'analytics' ? 'bg-white text-slate-900 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <BarChart size={16} /> Global Insights
          </button>
        </div>
      </div>

      {view === 'linktree' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-3 bg-white rounded-[4.5rem] border border-slate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
             <LinktreeDashboard />
           </div>
           <div className="space-y-6">
              <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl space-y-6">
                 <div className="flex items-center gap-3 text-indigo-400">
                   <Network size={20} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Platform Mix</span>
                 </div>
                 <div className="space-y-4">
                    {/* Fixed: data is explicitly typed in map to avoid unknown type errors */}
                    {Object.entries(distributionReport).slice(0, 5).map(([platform, data]: [string, any]) => (
                      <div key={platform} className="space-y-1.5">
                         <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                            <span className="text-slate-400">{platform}</span>
                            <span className="text-indigo-300">{data.count} Nodes</span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full" style={{ width: `${(data.count / 20) * 100}%` }} />
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                    Full Network Audit
                 </button>
              </div>

              <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl">
                 <div className="flex items-center gap-3 text-emerald-600 mb-6">
                    <Zap size={20} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Status</span>
                 </div>
                 <p className="text-xs font-bold text-slate-500 leading-relaxed">
                   Neural nodes are synchronized. Cuty.io reporting 100% API uptime. US traffic routing optimized.
                 </p>
              </div>
           </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-end">
            <button 
              onClick={getAiInsight}
              disabled={loadingInsight}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl transition-all disabled:opacity-50 active:scale-95 shadow-xl"
            >
              <Sparkles size={18} />
              {loadingInsight ? 'Neural Analysing...' : 'Generate AI Strategy'}
            </button>
          </div>

          {/* Primary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Visitors (GA)', value: '11.9K', icon: <Globe size={20} className="text-orange-600" />, trend: '+15.2%', color: 'bg-orange-50' },
              { label: 'Search Impressions', value: '38.4K', icon: <Search size={20} className="text-indigo-600" />, trend: '+8.4%', color: 'bg-indigo-50' },
              { label: 'Net Ad Revenue', value: '$12,450', icon: <DollarSign size={20} className="text-emerald-600" />, trend: '+28%', color: 'bg-emerald-50' },
              { label: 'Avg CTR (GSC)', value: '4.8%', icon: <MousePointer2 size={20} className="text-rose-600" />, trend: '+2.4%', color: 'bg-rose-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-5 ${stat.color} rounded-2xl shadow-inner group-hover:rotate-6 transition-transform`}>{stat.icon}</div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">{stat.trend}</span>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-10 rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden relative">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Indexing Node</h3>
                 <div className="p-2 bg-slate-50 rounded-xl text-slate-300 hover:text-indigo-600 transition-colors cursor-help">
                    <Info size={16} />
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-slate-50 p-10 rounded-[2.5rem] flex flex-col items-center justify-center border border-slate-100 shadow-inner group hover:bg-slate-100 transition-colors">
                   <span className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-tighter">Not Indexed</span>
                   <span className="text-6xl font-black text-slate-300 group-hover:text-rose-500 transition-colors">1</span>
                </div>
                <div className="bg-emerald-50 p-10 rounded-[2.5rem] flex flex-col items-center justify-center border border-emerald-100 shadow-inner group hover:bg-emerald-100 transition-colors">
                   <span className="text-[9px] font-black text-emerald-700 uppercase mb-3 tracking-tighter">Indexed</span>
                   <span className="text-6xl font-black text-emerald-500 group-hover:text-emerald-600 transition-colors">0</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs px-2">
                  <span className="text-slate-500 font-bold uppercase tracking-widest">Canonical Compliance</span>
                  <span className="font-black text-slate-900">40%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                   <div className="bg-indigo-500 h-full w-[40%] animate-pulse" />
                </div>
              </div>

              <button className="w-full mt-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 hover:bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-[2rem] transition-all active:scale-95">
                OPEN GSC ANALYTICS
              </button>
            </div>

            <div className="lg:col-span-2 bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Neural Signal Traffic</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">GSC Data Stream Active</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Sync</div>
                  <div className="text-xs font-black text-indigo-600">20 JAN 2026 • 09:42</div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#cbd5e1', fontSize: 10, fontWeight: 900}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#cbd5e1', fontSize: 10, fontWeight: 900}} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '32px', 
                        border: 'none', 
                        boxShadow: '0 40px 80px -15px rgb(0 0 0 / 0.2)', 
                        padding: '24px',
                        background: '#0f172a',
                        color: 'white'
                      }}
                      itemStyle={{ color: '#818cf8', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                      labelStyle={{ color: 'white', fontWeight: 900, marginBottom: '8px', fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="impressions" 
                      stroke="#4f46e5" 
                      strokeWidth={5} 
                      fillOpacity={1} 
                      fill="url(#colorImpressions)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {aiInsight && (
            <div className="bg-slate-950 p-16 rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(79,70,229,0.2)] relative overflow-hidden group border border-slate-900">
              <div className="absolute top-0 right-0 p-20 opacity-5 group-hover:scale-110 transition-transform text-indigo-500">
                 <Sparkles size={240} />
              </div>
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-6">
                  <div className="bg-indigo-600 p-5 rounded-3xl shadow-[0_0_30px_rgba(79,70,229,0.4)]">
                    <Sparkles className="text-white" size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-3xl uppercase tracking-tighter">AI Growth Strategy</h4>
                    <p className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.3em] mt-1">Synthesized by Gemini-3-Pro Node</p>
                  </div>
                </div>
                <div className="text-slate-300 text-xl leading-relaxed whitespace-pre-wrap font-medium max-w-4xl custom-scrollbar opacity-90">
                  {aiInsight}
                </div>
                <div className="pt-8 border-t border-white/5 flex gap-5">
                   <button className="px-8 py-4 bg-white text-slate-950 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-3 shadow-xl active:scale-95">
                     <Send size={16} /> Deploy Strategy
                   </button>
                   <button className="px-8 py-4 bg-white/5 text-white/50 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                     Refresh Insights
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;