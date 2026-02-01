import React from 'react';
import { INITIAL_ACCOUNTS } from '../constants';
import { AccountStatus, Account } from '../types';
import { 
  Search, Plus, Filter, MoreVertical, X, 
  Eye, EyeOff, Globe, Database, Mail, 
  Activity, Facebook, Instagram, Youtube, Twitter, 
  MessageSquare, Send as SendIcon, Tag, Layers
} from 'lucide-react';
import { triggerMakeEvent, WEBHOOK_EVENTS } from '../services/webhookService';

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = React.useState<Account[]>(INITIAL_ACCOUNTS);
  const [activeSetup, setActiveSetup] = React.useState<string>('All');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [showSecrets, setShowSecrets] = React.useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const setups = ['All', 'Shortlink', 'BD ToolX', 'SwiftCash Link', 'AffiRise Network', 'LinkSurge Pro', 'ZipLink Flow'];

  const [newAcc, setNewAcc] = React.useState({
    setup: 'BD ToolX',
    platform: 'Instagram',
    profileName: '',
    userId: '',
    email: '',
    password: '',
    notes: ''
  });

  const toggleSecret = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusStyle = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.ACTIVE: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case AccountStatus.PAUSED: return 'bg-amber-50 text-amber-700 border-amber-100';
      case AccountStatus.BANNED: return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  const getSetupColor = (name: string) => {
    switch (name) {
      case 'Shortlink': return 'bg-indigo-500';
      case 'BD ToolX': return 'bg-blue-600';
      case 'SwiftCash Link': return 'bg-emerald-600';
      case 'AffiRise Network': return 'bg-indigo-600';
      case 'LinkSurge Pro': return 'bg-orange-600';
      case 'ZipLink Flow': return 'bg-rose-600';
      default: return 'bg-slate-600';
    }
  };

  const filteredAccounts = React.useMemo(() => {
    let result = activeSetup === 'All' 
      ? accounts 
      : accounts.filter(acc => acc.setup === activeSetup);
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(acc => 
        acc.profileName.toLowerCase().includes(term) ||
        acc.userId.toLowerCase().includes(term) ||
        acc.email.toLowerCase().includes(term)
      );
    }
    return result;
  }, [accounts, activeSetup, searchTerm]);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const account: Account = {
      id: Math.random().toString(36).substr(2, 9),
      setup: newAcc.setup,
      platform: newAcc.platform,
      profileName: newAcc.profileName,
      userId: newAcc.userId,
      email: newAcc.email,
      password: newAcc.password,
      status: AccountStatus.ACTIVE,
      createdAt: new Date().toLocaleDateString(),
      lastPostAt: 'Never',
      score: 100,
      notes: newAcc.notes
    };
    setAccounts([account, ...accounts]);
    
    // ✅ Make.com Webhook Trigger
    triggerMakeEvent(WEBHOOK_EVENTS.ACCOUNT_CREATED, {
      id: account.id,
      setup: account.setup,
      platform: account.platform,
      profileName: account.profileName,
      userId: account.userId,
      email: account.email,
      timestamp: new Date().toISOString()
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Setup Vault</h2>
          <p className="text-slate-500 text-sm font-medium">Managing 6 core marketing setups independently.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
        >
          <Plus size={18} />
          REGISTER NEW PROFILE
        </button>
      </div>

      {/* Setup Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/50 rounded-2xl w-fit">
        {setups.map((setup) => (
          <button
            key={setup}
            onClick={() => setActiveSetup(setup)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeSetup === setup 
                ? 'bg-white text-slate-900 shadow-md scale-105' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {setup}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row gap-6 items-center justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search in ${activeSetup}...`} 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
            />
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-[10px] font-black text-slate-600 flex items-center gap-2">
               <Layers size={14} className="text-blue-500" />
               {filteredAccounts.length} {activeSetup === 'All' ? 'TOTAL' : activeSetup.toUpperCase()} PROFILES
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Name</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Username / UID</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Access</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role/Note</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Setup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Database size={48} />
                      <p className="text-xs font-black uppercase">No Accounts Found</p>
                    </div>
                  </td>
                </tr>
              ) : filteredAccounts.map((acc) => {
                const isFB = acc.platform.toLowerCase().includes('facebook') || acc.platform.toLowerCase().includes('fb');
                const isTG = acc.platform.toLowerCase().includes('telegram') || acc.platform.toLowerCase().includes('tg');
                const isWA = acc.platform.toLowerCase().includes('whatsapp') || acc.platform.toLowerCase().includes('wa');
                
                return (
                  <tr key={acc.id} className="hover:bg-slate-50/50 transition-all group">
                    {/* Platform */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${
                          acc.platform.toLowerCase().includes('instagram') ? 'bg-gradient-to-tr from-purple-500 to-pink-500' :
                          isFB ? 'bg-blue-600' :
                          acc.platform.toLowerCase().includes('youtube') ? 'bg-red-600' :
                          acc.platform.toLowerCase().includes('tiktok') ? 'bg-black' :
                          isTG ? 'bg-sky-500' :
                          isWA ? 'bg-emerald-500' : 'bg-slate-500'
                        }`}>
                          {isFB ? <Facebook size={20} /> : 
                           isTG ? <SendIcon size={20} /> :
                           isWA ? <MessageSquare size={20} /> :
                           <Globe size={20} />}
                        </div>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">{acc.platform}</span>
                      </div>
                    </td>

                    {/* Profile Name */}
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-slate-900 whitespace-nowrap">{acc.profileName}</span>
                    </td>

                    {/* UID */}
                    <td className="px-8 py-5">
                      <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                        {acc.userId}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
                        <Mail size={14} className="text-slate-300" />
                        {acc.email}
                      </div>
                    </td>

                    {/* Password */}
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-between gap-3 bg-slate-100/50 px-3 py-2 rounded-xl border border-slate-200/50 max-w-[140px]">
                        <span className="text-[10px] font-mono font-bold text-slate-700 truncate">
                          {acc.password === 'N/A' ? '—' : (showSecrets[acc.id + '_pass'] ? acc.password : '••••••••')}
                        </span>
                        {acc.password !== 'N/A' && (
                          <button onClick={() => toggleSecret(acc.id + '_pass')} className="text-slate-400 hover:text-blue-600 transition-colors">
                            {showSecrets[acc.id + '_pass'] ? <EyeOff size={14}/> : <Eye size={14}/>}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border tracking-widest w-fit shadow-sm ${getStatusStyle(acc.status)}`}>
                        {acc.status}
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                        <Tag size={12} />
                        <span className="truncate max-w-[120px]">{acc.notes || 'No Note'}</span>
                      </div>
                    </td>

                    {/* Setup Tag */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getSetupColor(acc.setup)}`}></div>
                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{acc.setup}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[2.5rem]">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg"><Database size={24}/></div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">Profile Registration</h3>
                  <p className="text-xs font-bold text-slate-400">Select which setup this profile belongs to.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddAccount} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Target Setup *</label>
                  <select 
                    className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-black uppercase bg-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                    value={newAcc.setup}
                    onChange={(e) => setNewAcc({...newAcc, setup: e.target.value})}
                  >
                    {setups.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Platform *</label>
                  <select 
                    className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-black uppercase bg-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    value={newAcc.platform}
                    onChange={(e) => setNewAcc({...newAcc, platform: e.target.value})}
                  >
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>YouTube</option>
                    <option>X (Twitter)</option>
                    <option>Facebook (Prof)</option>
                    <option>Facebook (Pag)</option>
                    <option>Facebook (Gro)</option>
                    <option>Telegram (M)</option>
                    <option>WhatsApp (M)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Profile Name *</label>
                  <input required type="text" placeholder="e.g. Abhimani Puja" className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
                    value={newAcc.profileName} onChange={(e) => setNewAcc({...newAcc, profileName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Username / UID *</label>
                  <input required type="text" placeholder="@username" className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
                    value={newAcc.userId} onChange={(e) => setNewAcc({...newAcc, userId: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Email Address *</label>
                  <input required type="email" placeholder="user@gmail.com" className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
                    value={newAcc.email} onChange={(e) => setNewAcc({...newAcc, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Password</label>
                  <input type="text" placeholder="BD@2026@tool" className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-mono font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
                    value={newAcc.password} onChange={(e) => setNewAcc({...newAcc, password: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl active:scale-95">
                REGISTER PROFILE TO DATABASE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;