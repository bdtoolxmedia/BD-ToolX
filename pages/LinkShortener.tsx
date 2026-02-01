import React, { useState, useMemo, useEffect } from 'react';
import { 
  Zap, Copy, Check, Download, Layers, 
  ExternalLink, MousePointer2, RefreshCw, 
  Terminal, Code2, Globe, FileText, Share2, 
  Plus, Trash2, Smartphone, Monitor, AlertCircle,
  Cpu, Timer, X, Settings2, Globe2, ShieldCheck, 
  Code, CheckCircle2, Info, ChevronRight, BarChart3,
  Network, Activity, PieChart, ShieldAlert, History
} from 'lucide-react';
import { autoDistributor, SHORTLINK_CONFIGS } from '../auto-distributor';
import { INITIAL_ACCOUNTS } from '../constants';
import { triggerMakeEvent, WEBHOOK_EVENTS, getWebhookService } from '../services/webhookService';

interface ShortenedResult {
  id: string;
  original: string;
  platform: string;
  shortUrl: string;
  timestamp: string;
  status: 'success' | 'error';
  isQuick?: boolean;
  error?: string;
  accountRef?: string;
}

const ErrorLogDisplay: React.FC = () => {
  const [errors, setErrors] = useState<any[]>([]);
  const webhookService = getWebhookService();
  
  const loadErrors = () => {
    if (webhookService) {
      setErrors(webhookService.getErrorLogs(5));
    }
  };
  
  useEffect(() => {
    loadErrors();
    const interval = setInterval(loadErrors, 10000);
    return () => clearInterval(interval);
  }, []);

  if (errors.length === 0) return null;
  
  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-6 border border-rose-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-rose-400">
          <ShieldAlert size={24} />
          <h3 className="text-xl font-black uppercase tracking-tighter">Neural Error Terminal</h3>
        </div>
        <span className="text-[10px] font-black bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full uppercase tracking-widest border border-rose-500/20">Active Monitoring</span>
      </div>
      <div className="space-y-3">
        {errors.map(err => (
          <div key={err.id} className={`p-5 rounded-2xl border transition-all ${err.resolved ? 'bg-slate-800/50 border-white/5 opacity-50' : 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black uppercase text-rose-400 tracking-widest">{err.payload.context}</span>
              <span className="text-[9px] font-bold text-slate-500">{new Date(err.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-xs font-bold text-slate-300 mb-3">{err.payload.error?.message}</p>
            {!err.resolved && (
              <button 
                onClick={() => { webhookService?.markErrorResolved(err.id); loadErrors(); }}
                className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Check size={12} /> Mark Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const LinkShortener: React.FC = () => {
  const [urls, setUrls] = useState('');
  const [activePlatforms, setActivePlatforms] = useState<string[]>(['Oii.io', 'Cuty.io', 'FC.LC']);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<ShortenedResult[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [synthesisMode, setSynthesisMode] = useState<'api' | 'instant' | 'auto'>('api');
  
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [domainType, setDomainType] = useState<'exclude' | 'include'>('exclude');
  const [domains, setDomains] = useState('mega.nz\n*.zippyshare.com\ndepositfiles.com');

  const platforms = Object.entries(SHORTLINK_CONFIGS).map(([name, cfg]) => ({
    id: name.toLowerCase().replace('.', ''),
    name,
    color: name === 'Oii.io' ? 'bg-emerald-600' : name === 'Cuty.io' ? 'bg-indigo-600' : 'bg-slate-700',
    icon: name.substring(0, 2),
    token: cfg.apiKey
  }));

  const distributionReport = useMemo(() => autoDistributor.getDistributionReport(), []);

  const handleMassShrink = async () => {
    if (!urls.trim()) return;
    setProcessing(true);
    
    const urlList = urls.split('\n').filter(u => u.trim().startsWith('http'));
    const newResults: ShortenedResult[] = [];
    const webhookService = getWebhookService();
    
    for (const url of urlList) {
      if (synthesisMode === 'auto') {
        const targetSetups = ['BD ToolX', 'SwiftCash Link', 'AffiRise Network', 'LinkSurge Pro', 'ZipLink Flow'];
        for (const setup of targetSetups) {
          const setupAcc = INITIAL_ACCOUNTS.find(a => a.setup === setup);
          if (setupAcc) {
            try {
              const shortUrl = await autoDistributor.generateShortUrl(setupAcc, url);
              if (shortUrl === 'FAILED' || shortUrl === url) throw new Error(`Platform API returned no result for ${setup}`);
              
              newResults.push({
                id: Math.random().toString(36).substr(2, 9),
                original: url,
                platform: autoDistributor.getPlatformForAccount(setupAcc),
                shortUrl,
                timestamp: new Date().toLocaleTimeString(),
                status: 'success',
                accountRef: setup
              });
            } catch (err: any) {
              // ✅ CRITICAL: Enhanced Error Logging
              webhookService?.logError('Auto Mass Shrink Failure', err, {
                url, setup, platform: setupAcc.platform
              });
              
              newResults.push({
                id: Math.random().toString(36).substr(2, 9),
                original: url,
                platform: setupAcc.platform,
                shortUrl: 'FAILED',
                timestamp: new Date().toLocaleTimeString(),
                status: 'error',
                error: err.message,
                accountRef: setup
              });
            }
          }
        }
      } else {
        for (const pName of activePlatforms) {
          try {
            const dummyAccount = INITIAL_ACCOUNTS.find(a => a.platform === pName) || { setup: 'Manual', platform: pName } as any;
            const shortUrl = await autoDistributor.generateShortUrl(dummyAccount, url);
            
            if (shortUrl === 'FAILED' || shortUrl === url) throw new Error(`API node ${pName} connection timed out`);

            newResults.push({
              id: Math.random().toString(36).substr(2, 9),
              original: url,
              platform: pName,
              shortUrl,
              timestamp: new Date().toLocaleTimeString(),
              status: 'success'
            });
          } catch (err: any) {
            // ✅ CRITICAL: Enhanced Error Logging
            webhookService?.logError('Manual Shrink Failure', err, { url, platform: pName });

            newResults.push({
              id: Math.random().toString(36).substr(2, 9),
              original: url,
              platform: pName,
              shortUrl: 'FAILED',
              timestamp: new Date().toLocaleTimeString(),
              status: 'error',
              error: err.message
            });
          }
        }
      }
    }

    setResults([...newResults, ...results]);
    setUrls('');
    setProcessing(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    if (text === 'FAILED') return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const bookmarkletCode = `javascript:(function(){var url=window.location.href;alert('Neural Shortening: '+url);})();`;

  const getGeneratedScript = () => {
    const apiToken = platforms.find(p => p.name === 'FC.LC')?.token || 'f160fc9b8ac819529efb9c612a3c0ffb6ef648d5';
    const domainList = domains.split('\n').filter(d => d.trim()).map(d => `'${d.trim()}'`).join(', ');
    const domainVar = domainType === 'exclude' ? 'ad_exclude_domains' : 'ad_include_domains';
    
    return `<script type="text/javascript">
    var ad_url = 'https://fc.lc/';
    var ad_api_key = '${apiToken}';
    var ad_type = '2';
    var ${domainVar} = [${domainList}];
</script>
<script src="https://fc.lc/js/full-page-script.js"></script>`;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Neural Link Hub</h1>
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] mt-3">Universal Multi-Platform Shortening System</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1.5 rounded-2xl shadow-xl border border-slate-100">
             <button 
                onClick={() => setSynthesisMode('api')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${synthesisMode === 'api' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
             >
                <Cpu size={14} /> Node API
             </button>
             <button 
                onClick={() => setSynthesisMode('auto')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${synthesisMode === 'auto' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
             >
                <RefreshCw size={14} /> Auto-Sync
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Nodes', value: INITIAL_ACCOUNTS.length, icon: <Network size={20} />, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Active Clusters', value: platforms.length, icon: <Activity size={20} />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Marketing Sectors', value: '5', icon: <Layers size={20} />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Neural Sync', value: '99.9%', icon: <RefreshCw size={20} />, color: 'bg-amber-50 text-amber-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl flex items-center gap-6">
            <div className={`p-4 rounded-2xl ${stat.color} shadow-inner`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3.5rem] border border-slate-200 p-10 shadow-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <RefreshCw size={120} className={processing ? 'animate-spin' : ''} />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center ml-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Neural Mass Processor</label>
                {synthesisMode === 'auto' && (
                  <div className="flex items-center gap-2 text-emerald-500 animate-pulse">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Setup Distribution Active</span>
                  </div>
                )}
              </div>
              <textarea 
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="https://example1.com&#10;https://example2.com"
                className="w-full p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 font-bold text-sm h-64 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all shadow-inner resize-none"
              />
            </div>

            {synthesisMode !== 'auto' && (
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Target Platforms</label>
                <div className="flex flex-wrap gap-3">
                  {platforms.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setActivePlatforms(prev => 
                        prev.includes(p.name) ? prev.filter(n => n !== p.name) : [...prev, p.name]
                      )}
                      className={`px-5 py-3 rounded-2xl flex items-center gap-3 transition-all border ${
                        activePlatforms.includes(p.name) 
                          ? `${p.color} text-white border-transparent shadow-lg scale-105` 
                          : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-black text-[10px]">{p.icon}</span>
                      <span className="font-black text-[10px] uppercase tracking-widest">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleMassShrink}
              disabled={processing || !urls.trim()}
              className={`w-full py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 ${synthesisMode === 'auto' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-black'} text-white`}
            >
              {processing ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
              {processing ? 'Processing Neural Streams...' : synthesisMode === 'auto' ? 'Global Multi-Setup Sync' : 'Mass Shrink & Sync'}
            </button>
          </div>

          <ErrorLogDisplay />

          <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Processed Fragments</h3>
              <div className="flex gap-2">
                <button className="p-3 text-slate-400 hover:text-slate-900 transition-all"><Download size={20} /></button>
                <button className="p-3 text-slate-400 hover:text-rose-500 transition-all" onClick={() => setResults([])}><Trash2 size={20} /></button>
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                  <tr className="border-b border-slate-100">
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Origin</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural Key</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-8 py-20 text-center text-slate-300 font-black text-[10px] uppercase tracking-[0.3em]">No fragments generated yet</td>
                    </tr>
                  ) : results.map(res => (
                    <tr key={res.id} className="group hover:bg-slate-50 transition-all">
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-600 border border-slate-200 w-fit">{res.platform}</span>
                          {res.accountRef && <span className="text-[8px] font-black text-indigo-500 uppercase tracking-tighter">{res.accountRef} Setup</span>}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className={`text-xs font-black truncate max-w-[200px] ${res.status === 'error' ? 'text-rose-500' : 'text-slate-900'}`}>{res.shortUrl}</span>
                          <span className="text-[9px] font-bold text-slate-400 truncate max-w-[200px] mt-1">{res.status === 'error' ? res.error : res.original}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {res.status === 'error' ? (
                            <div className="p-3 text-rose-500"><AlertCircle size={16} /></div>
                          ) : (
                            <button 
                              onClick={() => copyToClipboard(res.shortUrl, res.id)}
                              className={`p-3 rounded-xl transition-all ${copiedId === res.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200'}`}
                            >
                              {copiedId === res.id ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <Smartphone size={120} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                  <Terminal size={24} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Bookmarklet</h3>
                  <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-1">Single-Click Shortening</p>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                Drag this script to your bookmarks bar. Click it on any page to instantly short & copy the URL.
              </p>
              <button 
                onClick={() => copyToClipboard(bookmarkletCode, 'bm')}
                className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
              >
                {copiedId === 'bm' ? <Check size={16} /> : <Copy size={16} />}
                {copiedId === 'bm' ? 'Copied' : 'Copy Script'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[3.5rem] border border-slate-200 p-10 shadow-sm group">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-emerald-600">
                  <Code2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Global Script</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Auto-Convert All Links</p>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Add this script to your website's <code>&lt;head&gt;</code> to automatically convert all external links.
              </p>
              <button 
                onClick={() => setShowScriptModal(true)}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
              >
                <Code2 size={16} /> Generate Site Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {showScriptModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden relative border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl shadow-lg border border-white/10">
                  <Globe2 size={28} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Global Script Architect</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">FC.LC Universal Conversion Engine</p>
                </div>
              </div>
              <button onClick={() => setShowScriptModal(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex gap-4">
                 <div className="p-3 bg-white text-indigo-600 rounded-xl h-fit shadow-sm"><Info size={20} /></div>
                 <div>
                    <h4 className="text-[11px] font-black text-indigo-900 uppercase tracking-widest mb-1">Automatic Link Conversion</h4>
                    <p className="text-[10px] font-bold text-indigo-700/70 leading-relaxed">
                       To automatically shorten all the links on your website, simply add a script! Copy-and-paste the generated code below on to your webpage or blog and the links will be updated automatically.
                    </p>
                 </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Domains selection type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setDomainType('include')}
                      className={`p-6 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden group ${domainType === 'include' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Plus size={18} className={domainType === 'include' ? 'text-indigo-600' : 'text-slate-400'} />
                        <span className={`text-[11px] font-black uppercase tracking-widest ${domainType === 'include' ? 'text-indigo-900' : 'text-slate-400'}`}>Include</span>
                      </div>
                      <p className={`text-[9px] font-bold leading-relaxed ${domainType === 'include' ? 'text-indigo-700/60' : 'text-slate-400'}`}>
                        Use this option if you want to short only links from the following domains list.
                      </p>
                      {domainType === 'include' && <div className="absolute top-0 right-0 p-3"><CheckCircle2 size={16} className="text-indigo-600" /></div>}
                    </button>
                    
                    <button 
                      onClick={() => setDomainType('exclude')}
                      className={`p-6 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden group ${domainType === 'exclude' ? 'border-rose-600 bg-rose-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Trash2 size={18} className={domainType === 'exclude' ? 'text-rose-600' : 'text-slate-400'} />
                        <span className={`text-[11px] font-black uppercase tracking-widest ${domainType === 'exclude' ? 'text-rose-900' : 'text-slate-400'}`}>Exclude</span>
                      </div>
                      <p className={`text-[9px] font-bold leading-relaxed ${domainType === 'exclude' ? 'text-rose-700/60' : 'text-slate-400'}`}>
                        Use this option if you wish to short every link on your website but exclude only the links from the following list.
                      </p>
                      {domainType === 'exclude' && <div className="absolute top-0 right-0 p-3"><CheckCircle2 size={16} className="text-rose-600" /></div>}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center ml-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Domains Registry</label>
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">Wildcards Supported</span>
                  </div>
                  <textarea 
                    value={domains}
                    onChange={(e) => setDomains(e.target.value)}
                    placeholder="mega.nz&#10;*.zippyshare.com&#10;depositfiles.com"
                    className="w-full p-6 rounded-[2.5rem] bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none focus:ring-8 focus:ring-indigo-500/5 transition-all h-32 resize-none shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              <button 
                onClick={() => setShowScriptModal(false)}
                className="flex-1 py-5 bg-white border border-slate-200 text-slate-400 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
              >
                Close Terminal
              </button>
              <button 
                onClick={() => copyToClipboard(getGeneratedScript(), 'script-final')}
                className="flex-[2] py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
              >
                {copiedId === 'script-final' ? <CheckCircle2 size={18} /> : <Zap size={18} fill="currentColor" />}
                {copiedId === 'script-final' ? 'Script Copied' : 'Copy Generated Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkShortener;