import React, { useState } from 'react';
import { 
  Sparkles, MessageSquare, Image as ImageIcon, Video, 
  Send, Loader2, Bot, Play, CheckCircle2, Mic, MicOff, 
  Power, Film, Trash, TrendingUp, Zap, Activity as ActivityIcon, 
  Layers, ShieldCheck, CloudUpload, HardDrive, RefreshCw, Link as LinkIcon, Check, Copy
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import AutomationSection from './AutomationSection';
import BioLinkEditor from '../components/BioLinkEditor';

type TabType = 'chat' | 'campaign' | 'biolink' | 'automation';

const AITools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [campaignUrl, setCampaignUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runCampaignArchitect = async () => {
    if (!campaignUrl) return;
    setGenerating(true);
    
    // Safe access to API Key via process.env definition in vite.config.ts
    const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || '';
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Act as a senior social media marketer. For this destination URL: ${campaignUrl}, generate a comprehensive 3-stage distribution strategy:
    1. 3 highly engaging Facebook post variants with emojis and community hooks.
    2. 3 Instagram captions with trending niche hashtags.
    3. 2 Telegram broadcast templates for high conversion.
    4. Suggested shortlink platforms for each stage based on risk/traffic tier.
    Return the response in a professional, structured markdown format.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      setResults(response.text);
    } catch (e) {
      console.error(e);
      setResults("Neural node error: Unable to synthesize strategy. Check API connection.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-6xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-5">AI Studio <Sparkles className="text-indigo-600 animate-pulse" size={54} /></h1>
          <p className="text-slate-400 font-bold uppercase text-[12px] tracking-[0.5em] mt-4">Neural Marketing Command Center • BDToolX v2.9</p>
        </div>
      </div>

      <div className="flex gap-2 p-2.5 bg-slate-200/50 rounded-[2.5rem] w-fit shadow-inner border border-slate-200/40">
        {(['chat', 'campaign', 'biolink', 'automation'] as TabType[]).map(t => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t)} 
            className={`px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap ${activeTab === t ? 'bg-white text-slate-900 shadow-2xl scale-105 border border-slate-100' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {t === 'chat' ? 'Neural Chat' : 
             t === 'campaign' ? 'Campaign Architect' : 
             t === 'biolink' ? 'Bio Links' : 'Automation'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[4.5rem] border border-slate-200 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] overflow-hidden min-h-[750px] flex flex-col">
        {activeTab === 'automation' && <AutomationSection />}
        {activeTab === 'biolink' && <BioLinkEditor />}
        
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[750px]">
            <div className="flex-1 p-20 flex flex-col items-center justify-center opacity-5 text-center space-y-8">
              <MessageSquare size={160} />
              <p className="text-xl font-black uppercase tracking-[0.8em]">Neural Core Ready</p>
            </div>
            <div className="p-12 bg-slate-50 border-t flex gap-5">
              <input type="text" className="flex-1 p-6 rounded-[2rem] bg-white border border-slate-200 shadow-2xl outline-none font-bold text-sm px-10" placeholder="Initiate neural context..." />
              <button className="p-7 bg-slate-900 text-white rounded-full hover:bg-black transition-all shadow-xl"><Send size={28}/></button>
            </div>
          </div>
        )}

        {activeTab === 'campaign' && (
          <div className="p-20 space-y-12">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="p-6 bg-indigo-50 rounded-full inline-block text-indigo-600 mb-4">
                <Layers size={48} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Campaign Architect</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">One Link. Total Platform Domination.</p>
              
              <div className="flex gap-4 p-4 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                <input 
                  type="text" 
                  value={campaignUrl}
                  onChange={(e) => setCampaignUrl(e.target.value)}
                  placeholder="Paste your destination link..." 
                  className="flex-1 bg-white p-6 rounded-[1.8rem] outline-none font-bold text-sm shadow-sm border border-slate-200" 
                />
                <button 
                  onClick={runCampaignArchitect}
                  disabled={generating}
                  className="px-10 bg-indigo-600 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
                >
                  {generating ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
                  Synthesize
                </button>
              </div>
            </div>

            {results && (
              <div className="mt-20 bg-slate-950 p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                  <Sparkles size={200} />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-8">
                    <CheckCircle2 className="text-emerald-400" size={32} />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Synthesized Results</h3>
                  </div>
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap font-medium text-lg text-slate-300">
                    {results}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AITools;