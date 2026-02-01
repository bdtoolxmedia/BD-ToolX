import React, { useState } from 'react';
import { 
  Palette, Layout, ImageIcon, Type, 
  Link as LinkIcon, Eye, Download,
  Copy, Check, ArrowUpDown, Trash2,
  Save, Undo, Redo, Layers, Sparkles,
  Smartphone, Monitor, Zap, Globe, MousePointer2,
  // Fix: Added missing BarChart and Plus imports to resolve build errors
  BarChart, Plus
} from 'lucide-react';

const BioLinkEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'links' | 'design' | 'analytics'>('links');
  
  const themes = [
    { id: 'gradient-1', name: 'Sunset Flow', colors: 'from-orange-500 to-rose-600' },
    { id: 'gradient-2', name: 'Ocean Depth', colors: 'from-blue-500 to-cyan-600' },
    { id: 'gradient-3', name: 'Cyber Neon', colors: 'from-purple-600 to-pink-600' },
    { id: 'gradient-4', name: 'Forest Node', colors: 'from-emerald-500 to-green-600' },
    { id: 'gradient-5', name: 'Royal Pulse', colors: 'from-indigo-600 to-purple-700' },
    { id: 'gradient-6', name: 'Amber Glow', colors: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="p-10 space-y-12 animate-in fade-in duration-500 bg-white/50 h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Link Node Architect</h1>
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] mt-3">Synthesize your cross-platform digital identity</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-5 bg-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-3 border border-slate-200 shadow-sm">
            <Eye size={18} /> View Live Node
          </button>
          <button className="px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-2xl shadow-slate-200">
            <Save size={18} /> Sync Metadata
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Side: Controls */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex gap-2 p-2 bg-slate-100/80 rounded-[1.5rem] w-fit shadow-inner border border-slate-200/50">
            {(['links', 'design', 'analytics'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] transition-all ${
                  activeTab === tab ? 'bg-white text-slate-900 shadow-xl scale-105 border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'links' && <LinkIcon size={14} className="inline mr-2 mb-0.5" />}
                {tab === 'design' && <Palette size={14} className="inline mr-2 mb-0.5" />}
                {/* Fix: BarChart component now correctly imported */}
                {tab === 'analytics' && <BarChart size={14} className="inline mr-2 mb-0.5" />}
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[4rem] border border-slate-100 p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] min-h-[600px] relative overflow-hidden">
            {activeTab === 'links' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                {/* AI Suggestions Box */}
                <div className="p-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                    <Sparkles size={180} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-8">
                      <div className="p-5 bg-white/20 backdrop-blur-xl rounded-[1.5rem] shadow-xl border border-white/10">
                        <Sparkles size={32} className="text-indigo-200" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight">Neural Suggestions</h3>
                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.3em] mt-1">AI Engine insights for higher CTR</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {['Digital Course Path', 'Affiliate Revenue Stream', 'Support Terminal', 'Neural Subscription'].map((item, idx) => (
                        <button key={idx} className="p-6 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 transition-all text-left group/item flex items-center justify-between">
                          <div>
                             <div className="font-black text-xs uppercase tracking-widest mb-1">{item}</div>
                             <div className="text-[9px] font-bold opacity-50 uppercase tracking-widest">+ Initialize Link</div>
                          </div>
                          {/* Fix: Plus component now correctly imported */}
                          <Plus size={16} className="opacity-40 group-hover/item:rotate-90 group-hover/item:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-4">
                    <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.3em] flex items-center gap-3">
                      <Layers size={16} className="text-indigo-500" />
                      Active Node Stack (6)
                    </h4>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                      + Add New Node
                    </button>
                  </div>

                  {[1, 2, 3].map(item => (
                    <div key={item} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white group transition-all duration-500 hover:shadow-2xl hover:border-indigo-100/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-slate-300 group-hover:text-indigo-500 group-hover:border-indigo-100 transition-all shadow-sm">
                            <ArrowUpDown size={24} className="cursor-grab active:cursor-grabbing" />
                          </div>
                          <div>
                            <div className="font-black text-slate-900 uppercase text-lg tracking-tighter">
                              {item === 1 ? 'Instagram Main Flow' : item === 2 ? 'Passive Income Guide' : 'Neural Support'}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                               <Globe size={12} />
                               https://bdtoolx.com/links/active_{item}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col items-end">
                             <div className="text-xl font-black text-slate-900 tracking-tighter">
                               {item === 1 ? '1,245' : item === 2 ? '2,341' : '789'}
                             </div>
                             <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">hits</div>
                          </div>
                          <button className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="space-y-8">
                  <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.4em] ml-2">Neural Skin Selection</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {themes.map(theme => (
                      <button
                        key={theme.id}
                        className={`h-40 rounded-[3rem] bg-gradient-to-br ${theme.colors} border-[6px] border-white shadow-xl hover:scale-105 transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <span className="text-white font-black text-[11px] uppercase tracking-widest relative z-10 drop-shadow-md">{theme.name}</span>
                        <div className="w-8 h-1 bg-white/40 rounded-full relative z-10 group-hover:w-16 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Profile Identity</label>
                    <input type="text" defaultValue="BDToolX AI" className="w-full p-6 rounded-3xl bg-slate-50 border border-slate-200 font-black text-sm uppercase tracking-tighter focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all shadow-inner" />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Neural Bio Context</label>
                    <textarea defaultValue="AI-Powered Content Orchestrator" className="w-full p-6 rounded-3xl bg-slate-50 border border-slate-200 font-bold text-sm h-24 resize-none focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all shadow-inner" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-12 animate-in zoom-in-95 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { val: '14.2K', label: 'Cycle Visitors', color: 'from-blue-50 to-blue-100', text: 'text-blue-600' },
                    { val: '8.4K', label: 'Link Interaction', color: 'from-indigo-50 to-indigo-100', text: 'text-indigo-600' },
                    { val: '24.8%', label: 'Efficiency CTR', color: 'from-emerald-50 to-emerald-100', text: 'text-emerald-600' }
                  ].map((s, i) => (
                    <div key={i} className={`p-10 bg-gradient-to-br ${s.color} rounded-[3rem] border border-white shadow-xl group hover:scale-105 transition-all`}>
                      <div className={`text-4xl font-black ${s.text} tracking-tighter mb-2`}>{s.val}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-[4rem] border border-slate-100 p-20 flex flex-col items-center justify-center text-center space-y-8 shadow-inner relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent animate-pulse" />
                   <div className="p-8 bg-white rounded-full shadow-2xl">
                     <Zap size={64} className="text-indigo-600 animate-bounce" fill="currentColor" />
                   </div>
                   <div>
                     <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">Neural Engine Syncing...</p>
                     <p className="text-xs font-bold text-slate-400 uppercase mt-2 tracking-widest">Synthesizing real-time hit data from global edge nodes</p>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Mockup Preview */}
        <div className="sticky top-24 h-[calc(100vh-160px)]">
           <div className="bg-slate-950 rounded-[5rem] p-12 h-full flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-900 relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-1000" />
              
              <div className="text-center mb-10 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                   <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Live Monitor</h3>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Neural Uplink</p>
              </div>

              {/* Phone Body */}
              <div className="flex-1 bg-slate-900 rounded-[4rem] p-6 border border-white/5 shadow-inner relative overflow-hidden">
                 <div className="h-full w-full bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 rounded-[3rem] p-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white/20 rounded-full mb-8 border-4 border-white/10 shadow-2xl backdrop-blur-xl"></div>
                    <div className="h-5 bg-white/25 rounded-full w-48 mb-4 shadow-sm"></div>
                    <div className="h-3 bg-white/15 rounded-full w-32 mb-12 opacity-50"></div>
                    
                    <div className="w-full space-y-5">
                       {[1, 2, 3, 4].map(i => (
                         <div key={i} className="h-14 bg-white/20 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between px-6">
                            <div className="w-6 h-6 bg-white/30 rounded-lg" />
                            <div className="w-24 h-2 bg-white/40 rounded-full" />
                            <div className="w-4 h-4 bg-white/20 rounded-full" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Controls */}
              <div className="mt-10 space-y-6 relative z-10">
                <div className="flex gap-3 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                  <button className="flex-1 py-4 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Mobile</button>
                  <button className="flex-1 py-4 bg-transparent text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">Desktop</button>
                </div>
                
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 group-hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Node Terminal URL</span>
                    <Copy size={14} className="text-slate-500 hover:text-white cursor-pointer" />
                  </div>
                  <div className="text-xs font-black text-indigo-400 truncate uppercase tracking-tighter">bdtoolx.com/links/bdtoolx</div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BioLinkEditor;