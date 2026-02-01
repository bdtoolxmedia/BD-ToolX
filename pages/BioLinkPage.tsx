import React, { useState, useEffect } from 'react';
import {
  Instagram, Youtube, Twitter, Facebook, Linkedin,
  MessageCircle, Mail, Globe, ShoppingBag, Calendar,
  Video, Music, BookOpen, Heart, Share2, BarChart,
  ExternalLink, Copy, Check, QrCode, Palette,
  Settings, Eye, Trash2, Plus, Zap,
  DollarSign, Users, Clock, TrendingUp, Award
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// === TYPES ===
interface BioLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  clicks: number;
  isActive: boolean;
  order: number;
  type: 'social' | 'product' | 'course' | 'booking' | 'custom' | 'affiliate';
  backgroundColor: string;
  textColor: string;
}

interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: 'light' | 'dark' | 'gradient';
  bgColor: string;
  textColor: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
}

const BioLinkPage: React.FC = () => {
  // === STATE ===
  const [profile, setProfile] = useState<UserProfile>({
    username: 'bdtoolx',
    displayName: 'BDToolX AI',
    bio: 'AI-Powered Tools • Social Growth • Passive Income',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bdtoolx&backgroundColor=6366f1',
    theme: 'gradient',
    bgColor: 'from-indigo-600 via-purple-600 to-pink-500',
    textColor: 'text-white',
    buttonStyle: 'rounded'
  });

  const [links, setLinks] = useState<BioLink[]>([
    {
      id: '1',
      title: 'Instagram • Daily Tips',
      url: 'https://instagram.com/bdtoolx',
      icon: 'instagram',
      clicks: 1245,
      isActive: true,
      order: 1,
      type: 'social',
      backgroundColor: 'bg-gradient-to-r from-pink-500 to-rose-600',
      textColor: 'text-white'
    },
    {
      id: '2',
      title: 'YouTube Tutorials',
      url: 'https://youtube.com/@bdtoolx',
      icon: 'youtube',
      clicks: 856,
      isActive: true,
      order: 2,
      type: 'social',
      backgroundColor: 'bg-gradient-to-r from-red-500 to-red-700',
      textColor: 'text-white'
    },
    {
      id: '3',
      title: '💰 Earn $500/Month Guide',
      url: 'https://bdtoolx.com/earn',
      icon: 'dollar',
      clicks: 2341,
      isActive: true,
      order: 3,
      type: 'affiliate',
      backgroundColor: 'bg-gradient-to-r from-emerald-500 to-green-600',
      textColor: 'text-white'
    },
    {
      id: '4',
      title: '📚 Free AI Tools Access',
      url: 'https://bdtoolx.com/tools',
      icon: 'zap',
      clicks: 1892,
      isActive: true,
      order: 4,
      type: 'product',
      backgroundColor: 'bg-gradient-to-r from-amber-500 to-orange-600',
      textColor: 'text-white'
    },
    {
      id: '5',
      title: '📞 1:1 Growth Session',
      url: 'https://calendly.com/bdtoolx',
      icon: 'calendar',
      clicks: 456,
      isActive: true,
      order: 5,
      type: 'booking',
      backgroundColor: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      textColor: 'text-white'
    },
    {
      id: '6',
      title: '📧 Contact Support',
      url: 'mailto:bdtoolxmedia@gmail.com',
      icon: 'mail',
      clicks: 789,
      isActive: true,
      order: 6,
      type: 'custom',
      backgroundColor: 'bg-gradient-to-r from-indigo-500 to-blue-600',
      textColor: 'text-white'
    }
  ]);

  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'public' | 'stats'>('public');

  const pageUrl = window.location.href;
  const buttonStyles = {
    rounded: 'rounded-[1.5rem]',
    square: 'rounded-lg',
    pill: 'rounded-full'
  };

  const iconMap: Record<string, React.ReactNode> = {
    instagram: <Instagram size={24} />,
    youtube: <Youtube size={24} />,
    twitter: <Twitter size={24} />,
    facebook: <Facebook size={24} />,
    linkedin: <Linkedin size={24} />,
    message: <MessageCircle size={24} />,
    mail: <Mail size={24} />,
    globe: <Globe size={24} />,
    shopping: <ShoppingBag size={24} />,
    calendar: <Calendar size={24} />,
    video: <Video size={24} />,
    music: <Music size={24} />,
    book: <BookOpen size={24} />,
    dollar: <DollarSign size={24} />,
    zap: <Zap size={24} />,
    users: <Users size={24} />
  };

  useEffect(() => {
    const total = links.reduce((sum, link) => sum + link.clicks, 0);
    setTotalClicks(total);
    
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const randomLinkIndex = Math.floor(Math.random() * links.length);
        setLinks(prev => prev.map((link, idx) => 
          idx === randomLinkIndex ? { ...link, clicks: link.clicks + 1 } : link
        ));
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [links]);

  const handleLinkClick = (linkId: string) => {
    setLinks(prev => prev.map(link => 
      link.id === linkId ? { ...link, clicks: link.clicks + 1 } : link
    ));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName}'s Links`,
          text: `Check out my links on BDToolX`,
          url: pageUrl
        });
      } catch (err) { console.log('Share cancelled'); }
    } else { copyToClipboard(); }
  };

  const getThemeClasses = () => {
    switch (profile.theme) {
      case 'dark': return 'bg-slate-950 text-white';
      case 'gradient': return `bg-gradient-to-br ${profile.bgColor} text-white`;
      default: return 'bg-slate-50 text-slate-900';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${getThemeClasses()} overflow-x-hidden selection:bg-white/30`}>
      
      <div className="max-w-md mx-auto p-6 pt-16 sm:pt-24 pb-32">
        
        {/* Profile Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-4 ring-white/10">
              <img 
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl border-2 border-white/20 uppercase tracking-widest">
              Verified
            </div>
          </div>

          <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase drop-shadow-sm">
            {profile.displayName}
          </h1>
          <p className="text-lg font-medium opacity-90 mb-10 max-w-sm mx-auto leading-relaxed">
            {profile.bio}
          </p>

          {/* Neural Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { val: links.length, label: 'Nodes' },
              { val: totalClicks.toLocaleString(), label: 'Global Hits' },
              { val: '99.9%', label: 'Uptime' }
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-xl p-4 rounded-[1.5rem] border border-white/10 shadow-lg">
                <div className="text-2xl font-black tracking-tighter">{s.val}</div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex justify-center gap-3 mb-12">
            <button onClick={handleShare} className="px-6 py-4 bg-white/15 backdrop-blur-md rounded-2xl hover:bg-white/25 transition-all flex items-center gap-3 border border-white/10 group">
              <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="font-black text-[10px] uppercase tracking-widest">Share</span>
            </button>
            <button onClick={copyToClipboard} className="px-6 py-4 bg-white/15 backdrop-blur-md rounded-2xl hover:bg-white/25 transition-all flex items-center gap-3 border border-white/10 group min-w-[130px]">
              {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              <span className="font-black text-[10px] uppercase tracking-widest">{copied ? 'Copied' : 'Copy Key'}</span>
            </button>
            <button onClick={() => setShowQR(true)} className="px-4 py-4 bg-white/15 backdrop-blur-md rounded-2xl hover:bg-white/25 transition-all flex items-center justify-center border border-white/10 group">
              <QrCode size={20} />
            </button>
          </div>

          {/* QR Modal */}
          {showQR && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300" onClick={() => setShowQR(false)}>
              <div className="bg-white p-10 rounded-[3rem] max-w-sm w-full shadow-2xl scale-in-center" onClick={e => e.stopPropagation()}>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Neural Access Node</h3>
                  <div className="bg-slate-50 p-6 rounded-[2.5rem] inline-block border border-slate-100 shadow-inner">
                    <QRCodeSVG value={pageUrl} size={220} />
                  </div>
                  <p className="text-slate-400 mt-6 text-[10px] font-black uppercase tracking-widest truncate px-4">{pageUrl}</p>
                  <button
                    onClick={() => setShowQR(false)}
                    className="mt-8 w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95"
                  >
                    Close Terminal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Links Section */}
        <div className="space-y-4 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {links
            .filter(link => link.isActive)
            .sort((a, b) => a.order - b.order)
            .map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block ${link.backgroundColor} ${buttonStyles[profile.buttonStyle]} shadow-2xl hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] transform hover:-translate-y-1.5 transition-all duration-500 border border-white/20 overflow-hidden group`}
                onClick={() => handleLinkClick(link.id)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className={`p-4 ${link.textColor} bg-white/20 rounded-2xl backdrop-blur-md group-hover:rotate-12 group-hover:scale-110 transition-all shadow-inner border border-white/10`}>
                        {iconMap[link.icon] || <Globe size={24} />}
                      </div>
                      <div className="text-left">
                        <div className="font-black text-xl uppercase tracking-tighter group-hover:tracking-normal transition-all">{link.title}</div>
                        <div className="text-[9px] font-black opacity-60 mt-1 flex items-center gap-2 uppercase tracking-[0.2em]">
                          <Zap size={10} fill="currentColor" />
                          {link.url.replace('https://', '').split('/')[0]}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black tracking-tighter">{link.clicks.toLocaleString()}</div>
                      <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50">hits</div>
                    </div>
                  </div>
                  
                  {/* Neural Hit Bar */}
                  <div className="mt-5">
                    <div className="h-1 bg-white/15 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white/60 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        style={{ width: `${Math.min((link.clicks / 3000) * 100, 100)}%`, transition: 'width 2s ease-out' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
        </div>

        {/* Navigation / Stats Toggle */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-slate-900/60 backdrop-blur-2xl rounded-full p-2 flex shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-white/10">
            <button
              onClick={() => setViewMode('public')}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === 'public' 
                  ? 'bg-white text-slate-900 shadow-xl' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Eye size={16} className="inline mr-2" />
              Live
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === 'stats' 
                  ? 'bg-white text-slate-900 shadow-xl' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <BarChart size={16} className="inline mr-2" />
              Analytics
            </button>
          </div>
        </div>

        <div className="text-center pb-12 pt-20 animate-pulse duration-[3000ms]">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Neural Uplink Active</span>
          </div>
          <div className="text-2xl font-black tracking-[0.8em] text-white opacity-20">BDTOOLX</div>
        </div>

      </div>
    </div>
  );
};

export default BioLinkPage;
