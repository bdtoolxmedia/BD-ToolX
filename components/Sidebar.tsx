import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Send, Link as LinkIcon, 
  Settings as SettingsIcon, Zap, Sparkles, RefreshCw,
  BarChart3, ShoppingBag, HardDrive, Activity, 
  AlertCircle, Wifi, WifiOff, Cloud
} from 'lucide-react';
import { getWebhookService } from '../services/webhookService';

const Sidebar: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [queueStats, setQueueStats] = useState({ pending: 0, failed: 0 });
  const [lastSync, setLastSync] = useState<string>('Just now');

  useEffect(() => {
    const webhookService = getWebhookService();
    if (!webhookService) return;

    const updateStats = () => {
      const stats = webhookService.getQueueStatus();
      setQueueStats({ pending: stats.pending, failed: stats.failed });

      if (stats.failed > 0) {
        setSyncStatus('offline');
      } else if (stats.pending > 0) {
        setSyncStatus('syncing');
      } else {
        setSyncStatus('online');
      }
    };

    updateStats();

    const handleSuccess = () => {
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSyncStatus('online');
    };

    webhookService.on('transmission_success', handleSuccess);
    webhookService.on('error_logged', () => setSyncStatus('offline'));

    const interval = setInterval(updateStats, 5000);
    return () => {
      clearInterval(interval);
      webhookService.removeListener('transmission_success', handleSuccess);
    };
  }, []);

  const handleManualSync = () => {
    const service = getWebhookService();
    if (service) {
      setSyncStatus('syncing');
      service.sendToMake('manual_sync_test', { timestamp: new Date().toISOString() })
        .then(() => setTimeout(() => setSyncStatus('online'), 1000));
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'AI Studio', path: '/aistudio', icon: <Sparkles size={20} className="text-indigo-500" /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} className="text-orange-500" /> },
    { name: 'Creator Nexus', path: '/marketplace', icon: <ShoppingBag size={20} className="text-purple-500" /> },
    { name: 'Media Vault', path: '/media', icon: <HardDrive size={20} className="text-blue-500" /> },
    { name: 'Link Hub', path: '/shortener', icon: <RefreshCw size={20} className="text-emerald-500" /> },
    { name: 'Accounts', path: '/accounts', icon: <Users size={20} /> },
    { name: 'Content Queue', path: '/content', icon: <Send size={20} /> },
    { name: 'Affiliates', path: '/affiliates', icon: <LinkIcon size={20} /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col z-[60]">
      <div className="p-6 border-b border-slate-100 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg">
            <Zap size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">BDToolX</h1>
        </div>
        
        <div className="sync-indicator-container">
          <div className={`sync-indicator ${syncStatus}`}>
            <div className="pulse-ring"></div>
            <div className="pulse-dot"></div>
          </div>
          <div className="sync-info">
            <span className="sync-status-text">
              {syncStatus === 'online' ? 'Neural Sync' : syncStatus === 'offline' ? 'Sync Offline' : 'Syncing...'}
            </span>
            <span className="sync-time">Last: {lastSync}</span>
          </div>
        </div>
      </div>

      {(queueStats.pending > 0 || queueStats.failed > 0) && (
        <div className="queue-status-badge">
          <div className="queue-item">
            <Activity size={14} />
            <span>Pending: {queueStats.pending}</span>
          </div>
          {queueStats.failed > 0 && (
            <div className="queue-item failed">
              <AlertCircle size={14} />
              <span>Failed: {queueStats.failed}</span>
            </div>
          )}
        </div>
      )}
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            {item.icon}
            <span className="text-sm font-bold uppercase tracking-tight">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-3 bg-slate-50 border-t border-slate-100">
        <button 
          onClick={handleManualSync}
          disabled={syncStatus === 'syncing'}
          className={`sync-btn ${syncStatus}`}
        >
          {syncStatus === 'syncing' ? <RefreshCw className="animate-spin" size={14} /> : syncStatus === 'online' ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'online' ? 'Sync Active' : 'Reconnect'}</span>
        </button>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Cloud size={14} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase">Make.com</span>
          </div>
          <div className={`status-dot ${syncStatus}`} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;