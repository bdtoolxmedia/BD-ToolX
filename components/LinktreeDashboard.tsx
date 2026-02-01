import React, { useState } from 'react';
import { 
  Link as LinkIcon, Globe, Instagram, Youtube, 
  Twitter, Facebook, Music, Heart, 
  BarChart, Settings, Copy, Check,
  Share2, QrCode, Palette, Layout,
  ImageIcon, Type, Wallet, CreditCard,
  Calendar, GraduationCap, Plus, Trash2, GripVertical,
  ChevronRight, ExternalLink, Smartphone, Monitor, Zap,
  Eye, MousePointer2
} from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string; // Icon name from lucide
  clicks: number;
  isActive: boolean;
  order: number;
  type: 'social' | 'product' | 'course' | 'booking' | 'custom';
}

const LinktreeDashboard: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([
    {
      id: '1',
      title: 'Instagram',
      url: 'https://instagram.com/yourhandle',
      icon: 'Instagram',
      clicks: 1245,
      isActive: true,
      order: 1,
      type: 'social'
    },
    {
      id: '2',
      title: 'YouTube Channel',
      url: 'https://youtube.com/c/yourchannel',
      icon: 'Youtube',
      clicks: 856,
      isActive: true,
      order: 2,
      type: 'social'
    },
    {
      id: '3',
      title: 'My Digital Product',
      url: 'https://yourstore.com/product',
      icon: 'CreditCard',
      clicks: 342,
      isActive: true,
      order: 3,
      type: 'product'
    },
    {
      id: '4',
      title: 'Book a Call',
      url: 'https://calendly.com/yourname',
      icon: 'Calendar',
      clicks: 189,
      isActive: true,
      order: 4,
      type: 'booking'
    },
    {
      id: '5',
      title: 'Free Course',
      url: 'https://course.yoursite.com',
      icon: 'GraduationCap',
      clicks: 567,
      isActive: true,
      order: 5,
      type: 'course'
    }
  ]);

  const [profile, setProfile] = useState({
    username: 'yourname',
    displayName: 'Your Name',
    bio: 'Digital Creator • Helping you grow online',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yourname',
    theme: 'indigo',
    bgColor: '#f8fafc',
    textColor: '#0f172a',
    buttonColor: '#4f46e5',
    buttonRadius: '1.5rem',
    customDomain: null as string | null
  });

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'links' | 'appearance' | 'analytics' | 'settings'>('links');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

  const linktreeUrl = `${profile.username}.cuty.io`;

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${linktreeUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLink = (id: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: 'New Link',
      url: 'https://',
      icon: 'LinkIcon',
      clicks: 0,
      isActive: true,
      order: links.length + 1,
      type: 'custom'
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (id: string, field: keyof LinkItem, value: any) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Instagram': return <Instagram size={18} />;
      case 'Youtube': return <Youtube size={18} />;
      case 'Twitter': return <Twitter size={18} />;
      case 'Facebook': return <Facebook size={18} />;
      case 'CreditCard': return <CreditCard size={18} />;
      case 'Calendar': return <Calendar size={18} />;
      case 'GraduationCap': return <GraduationCap size={18} />;
      default: return <LinkIcon size={18} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-120px)] animate-in fade-in duration-500 bg-white">
      {/* Editor Side */}
      <div className="flex-1 p-4 lg:p-8 space-y-8 overflow-y-auto custom-scrollbar border-r border-slate-100">
        {/* URL Toolbar */}
        <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white text-indigo-600 rounded-2xl shadow-sm border border-slate-100">
              <LinkIcon size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Link Instance</span>
              <span className="text-sm font-black text-slate-900 tracking-tight">{linktreeUrl}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={copyLink}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 shadow-sm"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">
              <Share2 size={14} />
              Publish
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 p-1.5 bg-slate-100 rounded-2xl w-fit shadow-inner">
          {[
            { id: 'links', icon: <LinkIcon size={16} />, label: 'Links' },
            { id: 'appearance', icon: <Palette size={16} />, label: 'Style' },
            { id: 'analytics', icon: <BarChart size={16} />, label: 'Growth' },
            { id: 'settings', icon: <Settings size={16} />, label: 'Nodes' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'bg-white text-slate-900 shadow-lg scale-105' 
                : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'links' && (
          <div className="space-y-6">
            <button 
              onClick={addLink}
              className="w-full p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Initialize New Link Node
            </button>

            <div className="space-y-4">
              {links.map((link) => (
                <div key={link.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-2xl hover:border-indigo-200 transition-all duration-300">
                  <div className="flex items-start gap-5">
                    <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl cursor-grab active:cursor-grabbing border border-slate-100">
                      <GripVertical size={20} />
                    </div>
                    <div className="flex-1 space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={link.title}
                            onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                            className="w-full text-xl font-black text-slate-900 bg-transparent border-none outline-none focus:ring-0 p-0 uppercase tracking-tighter"
                            placeholder="Enter Node Title"
                          />
                          <input 
                            type="text" 
                            value={link.url}
                            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                            className="w-full text-xs font-bold text-slate-400 bg-transparent border-none outline-none focus:ring-0 p-0 mt-1"
                            placeholder="https://your-destination.com"
                          />
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Node Power</span>
                            <button 
                              onClick={() => toggleLink(link.id)}
                              className={`w-12 h-6 rounded-full p-1 transition-all ${link.isActive ? 'bg-indigo-600' : 'bg-slate-200'}`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${link.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
                            <MousePointer2 size={12} />
                            <span className="text-[10px] font-black uppercase tracking-wider">{link.clicks.toLocaleString()} hits</span>
                          </div>
                          <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-xl">
                            <ImageIcon size={18} />
                          </button>
                        </div>
                        <button 
                          onClick={() => deleteLink(link.id)}
                          className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-2">
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Avatar Configuration</h3>
              <div className="flex items-center gap-8">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full overflow-hidden shadow-2xl border-4 border-white ring-2 ring-slate-100">
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-full transition-all backdrop-blur-sm">
                    <Plus size={28} />
                  </button>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={profile.displayName}
                      onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                      className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Neural Bio</label>
                    <textarea 
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm h-28 resize-none focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Neural Themes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { id: 'indigo', color: 'bg-indigo-600', name: 'Standard' },
                  { id: 'slate', color: 'bg-slate-900', name: 'Dark Ops' },
                  { id: 'emerald', color: 'bg-emerald-500', name: 'Profit' },
                  { id: 'rose', color: 'bg-rose-500', name: 'Viral' }
                ].map(theme => (
                  <button 
                    key={theme.id}
                    onClick={() => setProfile({...profile, theme: theme.id, buttonColor: theme.id === 'indigo' ? '#4f46e5' : theme.id === 'slate' ? '#0f172a' : theme.id === 'emerald' ? '#10b981' : '#f43f5e'})}
                    className={`p-5 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-4 ${profile.theme === theme.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50 hover:border-slate-200 bg-slate-50'}`}
                  >
                    <div className={`w-full aspect-[4/5] rounded-3xl ${theme.color} shadow-xl group-hover:scale-105 transition-transform`} />
                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Neural Views', value: '142.9K', trend: '+14.2%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Conversion', value: '38.4K', trend: '+9.1%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Retention', value: '62.5%', trend: '+4.3%', color: 'text-amber-600', bg: 'bg-amber-50' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <div className="flex items-end gap-3 mt-2">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter group-hover:scale-105 transition-transform origin-left">{stat.value}</h3>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${stat.bg} ${stat.color} shadow-sm`}>{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-10 rounded-[4rem] border border-slate-100 h-96 flex items-center justify-center">
              <div className="text-center opacity-30 space-y-6">
                <BarChart size={80} className="mx-auto text-indigo-600 animate-pulse" />
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-900">Neural Sync in Progress</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Fetching global node engagement data...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Side */}
      <div className="hidden lg:flex flex-col w-[500px] bg-slate-50 p-10 sticky top-[64px] h-[calc(100vh-64px)] overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Live Preview</h3>
          </div>
          <div className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-slate-200">
            <button onClick={() => setPreviewMode('mobile')} className={`p-2.5 rounded-xl transition-all ${previewMode === 'mobile' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}><Smartphone size={18} /></button>
            <button onClick={() => setPreviewMode('desktop')} className={`p-2.5 rounded-xl transition-all ${previewMode === 'desktop' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}><Monitor size={18} /></button>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className={`relative mx-auto transition-all duration-700 ease-out overflow-hidden ${previewMode === 'mobile' ? 'w-[340px] h-[680px] rounded-[3.5rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)]' : 'w-full h-full rounded-[2.5rem] shadow-2xl'}`}>
          <div className="absolute inset-0 bg-slate-950 ring-[12px] ring-slate-950 overflow-hidden">
            <div className="h-full w-full bg-white overflow-y-auto custom-scrollbar flex flex-col items-center px-8 py-16 text-center" style={{ backgroundColor: profile.bgColor }}>
              {/* Profile */}
              <div className="w-28 h-28 rounded-full overflow-hidden shadow-2xl border-4 border-white mb-8 group">
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
              <h1 className="text-2xl font-black mb-2 tracking-tighter" style={{ color: profile.textColor }}>@{profile.username}</h1>
              <p className="text-sm font-bold opacity-60 mb-12 max-w-[240px] leading-relaxed" style={{ color: profile.textColor }}>{profile.bio}</p>

              {/* Links */}
              <div className="w-full space-y-5">
                {links.filter(l => l.isActive).map(link => (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-5 px-8 flex items-center justify-between text-white font-black text-sm transition-all hover:scale-[1.05] active:scale-[0.97] shadow-2xl hover:brightness-110"
                    style={{ backgroundColor: profile.buttonColor, borderRadius: profile.buttonRadius }}
                  >
                    <div className="flex items-center gap-4">
                      {getIcon(link.icon)}
                      <span className="uppercase tracking-[0.15em]">{link.title}</span>
                    </div>
                    <ChevronRight size={18} className="opacity-40" />
                  </a>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-auto pt-16 pb-6">
                <div className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity cursor-default group">
                  <Zap size={16} fill="currentColor" className="group-hover:text-indigo-600 transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Powered</span>
                </div>
              </div>
            </div>
          </div>
          {/* Phone Speaker Notch */}
          {previewMode === 'mobile' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-slate-950 rounded-b-[2rem] z-10" />}
        </div>
      </div>
    </div>
  );
};

export default LinktreeDashboard;