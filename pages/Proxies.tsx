
import React from 'react';
import { INITIAL_PROXIES } from '../constants';
import { Shield, ShieldAlert, Wifi, WifiOff, RefreshCcw } from 'lucide-react';

const Proxies: React.FC = () => {
  const [proxies] = React.useState(INITIAL_PROXIES);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Proxy Manager</h2>
          <p className="text-slate-500">Global connection nodes for secure automation.</p>
        </div>
        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
          <RefreshCcw size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {proxies.map((proxy) => (
          <div key={proxy.id} className={`bg-white p-6 rounded-3xl border ${proxy.status === 'ONLINE' ? 'border-emerald-100 shadow-emerald-50/50' : 'border-rose-100 shadow-rose-50/50'} shadow-xl transition-transform hover:scale-[1.02]`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${proxy.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {proxy.status === 'ONLINE' ? <Wifi size={24} /> : <WifiOff size={24} />}
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase ${proxy.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {proxy.status}
              </span>
            </div>
            
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">IP:Port Address</p>
            <p className="text-lg font-black text-slate-800 font-mono mb-4">{proxy.ipPort}</p>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
              <div className={`w-2 h-2 rounded-full ${proxy.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
              <p className="text-xs font-semibold text-slate-500">Last check: 2 mins ago</p>
            </div>
          </div>
        ))}
        
        <button className="border-2 border-dashed border-slate-200 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-400 hover:text-blue-600">
          <div className="p-3 bg-slate-50 rounded-full group-hover:bg-white">
            <Shield size={32} />
          </div>
          <span className="font-bold">Add New Proxy</span>
        </button>
      </div>
    </div>
  );
};

export default Proxies;
