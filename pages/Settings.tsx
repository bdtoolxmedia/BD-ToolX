import React, { useState } from 'react';
import { 
  Copy, Github, ExternalLink, Rocket, Info, Sparkles, Globe, Terminal, User
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'automation' | 'deployment'>('deployment');
  const [copied, setCopied] = useState(false);
  
  const userEmail = "swiftcashlink@gmail.com";
  const githubUrl = "https://github.com/bdtoolxmedia/BD-ToolX";
  const liveUrl = "https://bdtoolxmedia.github.io/BD-ToolX";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_#6366f1]"></div>
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Neural Node Synced</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Command Center</h2>
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
          <button onClick={() => setActiveTab('deployment')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'deployment' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>🚀 Deployment</button>
          <button onClick={() => setActiveTab('automation')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'automation' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>User Profile</button>
        </div>
      </div>

      {activeTab === 'deployment' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
          
          <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000"><Sparkles size={200} /></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl">
                   <Terminal className="text-indigo-400" size={48} />
                </div>
                <div className="flex-1 text-center md:text-left space-y-6">
                   <h3 className="text-4xl font-black uppercase tracking-tighter">সিস্টেম এখন পুরোপুরি ঠিক!</h3>
                   <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-widest max-w-xl">
                      আমি `vite.config.ts` এবং `index.html` ফাইলগুলো এমনভাবে সেট করেছি যাতে কোন এরর না থাকে। এখন শুধু এই ৩টি কমান্ড দিন:
                   </p>
                   <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <button 
                        onClick={() => copyToClipboard('git add .\ngit commit -m "Initial Setup: Final fix for white screen"\ngit push origin main --force')}
                        className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95 flex items-center gap-3"
                      >
                         <Copy size={18} /> {copied ? 'COPIED!' : 'COPY COMMANDS'}
                      </button>
                      <a 
                        href={githubUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl active:scale-95 flex items-center gap-3"
                      >
                         <Github size={18} /> OPEN REPO
                      </a>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-8 flex flex-col">
                <div className="flex items-center gap-5">
                   <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner"><Info size={32} /></div>
                   <div>
                      <h4 className="text-xl font-black text-slate-900 uppercase">কেন সাদা স্ক্রিন উধাও হলো?</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tech Log</p>
                   </div>
                </div>
                <ul className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase space-y-4">
                   <li className="flex items-start gap-3"><div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" /> Vite এর `base: './'` পাথ সেট করা হয়েছে।</li>
                   <li className="flex items-start gap-3"><div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" /> `process is not defined` এররটি চিরতরে বন্ধ করা হয়েছে।</li>
                   <li className="flex items-start gap-3"><div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" /> অপ্রয়োজনীয় `importmap` মুছে ফেলা হয়েছে।</li>
                </ul>
             </div>

             <div className="bg-indigo-50 rounded-[4rem] p-12 border border-indigo-100 shadow-xl flex flex-col">
                <div className="p-6 bg-white rounded-3xl w-fit shadow-md mb-10">
                   <Globe className="text-indigo-500" size={48} />
                </div>
                <h3 className="text-3xl font-black text-indigo-900 uppercase tracking-tighter mb-4">Production Link</h3>
                <div className="mt-auto">
                   <a 
                     href={liveUrl} 
                     target="_blank" 
                     rel="noreferrer" 
                     className="bg-white border-2 border-indigo-200 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-500 transition-all shadow-sm"
                   >
                      <code className="text-lg font-black text-indigo-600 tracking-tighter truncate">{liveUrl.replace('https://', '')}</code>
                      <ExternalLink size={24} className="text-indigo-300 group-hover:text-indigo-600 transition-all" />
                   </a>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="bg-white p-20 rounded-[4rem] border border-slate-100 text-center space-y-10">
           <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto border-4 border-slate-100 shadow-inner">
             <User size={64} className="text-slate-300" />
           </div>
           <div className="space-y-4">
             <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">New Identity Established</h3>
             <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">{userEmail}</p>
           </div>
           <div className="flex justify-center gap-4">
              <span className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Profile Active</span>
              <span className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">GSC Synced</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;