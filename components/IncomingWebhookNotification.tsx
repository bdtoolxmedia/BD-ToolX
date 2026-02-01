import React from 'react';
import { Check, X, ExternalLink, Zap, Terminal } from 'lucide-react';

interface NotificationProps {
  notification: {
    id: number;
    title: string;
    message: string;
    timestamp: string;
    type: string;
    data?: any;
  };
  onDismiss: () => void;
}

const IncomingWebhookNotification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
  const handleAction = (action: string) => {
    switch (action) {
      case 'process':
        console.log('Neural Node: Processing remote task sequence...', notification.data);
        alert(`🚀 Deploying Action: ${notification.data?.event || 'Optimization Cycle'}`);
        break;
      case 'view_details':
        console.log('Neural Inspector:', notification);
        alert(`Metadata Fragment:\n${JSON.stringify(notification.data, null, 2)}`);
        break;
    }
    onDismiss();
  };

  return (
    <div className="webhook-notification animate-in slide-in-from-right duration-300">
      <div className="flex gap-5">
        <div className="notification-icon group-hover:rotate-12 transition-transform">
          <Zap size={18} fill="currentColor" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-tighter leading-none mb-1">
                {notification.title}
              </h4>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <button 
              onClick={onDismiss} 
              className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
            {notification.message}
          </p>

          {notification.data && (
            <div className="bg-slate-900 rounded-xl p-3 border border-white/5 space-y-2 group/data">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Terminal size={10} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Data Fragment</span>
                </div>
                <button 
                  onClick={() => handleAction('view_details')}
                  className="text-[8px] font-black text-slate-500 hover:text-white uppercase transition-colors"
                >
                  Expand Node
                </button>
              </div>
              <pre className="text-[9px] font-mono text-emerald-400/80 overflow-hidden text-ellipsis whitespace-nowrap opacity-60 group-hover/data:opacity-100 transition-opacity">
                {JSON.stringify(notification.data)}
              </pre>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button 
              onClick={() => handleAction('process')}
              className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <Check size={12} /> Establish Node
            </button>
            <button 
              onClick={onDismiss}
              className="flex-1 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Ignore Stream
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingWebhookNotification;