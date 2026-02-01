import React, { useState } from 'react';
import { 
  Users, Star, Search, Filter, 
  MapPin, Globe, Zap, ArrowUpRight, 
  MessageSquare, ShieldCheck, Award, 
  DollarSign, BarChart3, TrendingUp
} from 'lucide-react';

const creators = [
  { id: 1, name: 'Alex Rivera', niche: 'Tech & AI', followers: '1.2M', rate: '$500+', score: 98, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 2, name: 'Sarah Chen', niche: 'Lifestyle', followers: '850K', rate: '$350+', score: 95, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 3, name: 'Marcus Jordan', niche: 'Fitness', followers: '2.4M', rate: '$1.2K+', score: 92, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
  { id: 4, name: 'Elena Frost', niche: 'Finance', followers: '420K', rate: '$800+', score: 99, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
];

const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'creators' | 'campaigns'>('creators');

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Creator Nexus</h1>
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] mt-3">Bridge between Brands and Neural Influencers</p>
        </div>
        <div className="flex gap-4 p-1.5 bg-slate-200/50 rounded-2xl shadow-inner border border-slate-200">
          <button 
            onClick={() => setActiveTab('creators')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'creators' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}
          >
            Find Creators
          </button>
          <button 
            onClick={() => setActiveTab('campaigns')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'campaigns' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}
          >
            Active Campaigns
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Neural Filter</h3>
            
            <div className="space-y-4">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Niche Sector</label>
              <div className="space-y-2">
                {['Technology', 'Finance', 'Lifestyle', 'Gaming'].map(n => (
                  <label key={n} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500/20" />
                    <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{n}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Follower Range</label>
              <input type="range" className="w-full accent-indigo-600" />
              <div className="flex justify-between text-[9px] font-black text-slate-400">
                <span>10K</span>
                <span>10M+</span>
              </div>
            </div>

            <button className="w-full py-4 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
              Apply Neural Filter
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
               <Award size={120} />
            </div>
            <div className="relative z-10">
              <h4 className="text-lg font-black uppercase tracking-tighter">Become a Creator</h4>
              <p className="text-[10px] font-bold text-indigo-200 mt-2 leading-relaxed uppercase tracking-widest">Sync your nodes and start earning from top brands.</p>
              <button className="mt-6 px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl">Join Network</button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Search for neural influencers or campaigns..." 
              className="w-full pl-16 pr-8 py-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl outline-none font-bold text-sm focus:ring-8 focus:ring-indigo-500/5 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creators.map(creator => (
              <div key={creator.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <img src={creator.img} alt={creator.name} className="w-20 h-20 rounded-3xl object-cover bg-slate-50 border-4 border-white shadow-lg" />
                    <div className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 text-white rounded-xl shadow-lg border-2 border-white">
                      <ShieldCheck size={14} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{creator.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 uppercase">{creator.niche}</span>
                      <div className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{creator.followers} Follows</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Score', val: creator.score + '%', color: 'text-emerald-500' },
                    { label: 'Base Rate', val: creator.rate, color: 'text-indigo-600' },
                    { label: 'Engagement', val: '4.8%', color: 'text-amber-500' }
                  ].map((s, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</div>
                      <div className={`text-xs font-black ${s.color}`}>{s.val}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2">
                    <MessageSquare size={14} /> Contact
                  </button>
                  <button className="p-4 bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all border border-slate-200">
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
