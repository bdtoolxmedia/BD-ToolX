import React, { useState, useEffect } from 'react';
import { 
  Bot, Play, Clock, Zap, 
  CheckCircle, Pause, RefreshCw,
  FolderOpen, Filter, BarChart,
  MessageSquare, Share2, Users,
  FileText, Trash2, Plus, X, 
  Activity as ActivityIcon, Loader2
} from 'lucide-react';
import { automationEngine, AutomationConfig } from '../services/automation';
import { automationApi } from '../services/automationApi';
import { triggerMakeEvent, WEBHOOK_EVENTS } from '../services/webhookService';

export interface AutomationTask {
  id: string;
  name: string;
  type: 'social' | 'content' | 'engagement' | 'monitoring';
  status: 'active' | 'paused' | 'completed' | 'failed';
  schedule: string;
  lastRun: string;
  nextRun: string;
  platform: string;
  actions: number;
  successRate: number;
}

export interface AutomationLog {
  id: string;
  taskId: string;
  timestamp: string;
  action: string;
  status: 'success' | 'error';
  details: string;
}

const AUTOMATION_TEMPLATES = [
  {
    id: 'auto-1',
    name: 'Social Media Scheduler',
    description: 'Auto-post content across platforms',
    icon: <Share2 size={24} />,
    platforms: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'],
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    type: 'social'
  },
  {
    id: 'auto-2',
    name: 'Engagement Booster',
    description: 'Auto-like, comment & follow relevant content',
    icon: <Users size={24} />,
    platforms: ['Instagram', 'TikTok'],
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    type: 'engagement'
  },
  {
    id: 'auto-3',
    name: 'Content Generator',
    description: 'AI-powered content creation pipeline',
    icon: <FileText size={24} />,
    platforms: ['All'],
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    type: 'content'
  }
];

const AutomationSection: React.FC = () => {
  const [activeTasks, setActiveTasks] = useState<AutomationTask[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [newTask, setNewTask] = useState({ name: '', schedule: 'daily', content: '', platforms: [] as string[] });
  const [backendStatus, setBackendStatus] = useState({ online: false, tasks: 0 });

  useEffect(() => {
    const checkBackend = async () => {
      const status = await automationApi.getStatus();
      setBackendStatus({ online: !status.offline, tasks: status.active_tasks_count });
    };
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  const runTaskNow = async (taskId: string) => {
    const res = await automationApi.runTaskNow(taskId);
    if (res.success) {
      const timestamp = new Date().toLocaleString();
      const newLog: AutomationLog = {
        id: `log-${Date.now()}`,
        taskId,
        timestamp,
        action: 'Manual execution',
        status: 'success',
        details: res.message
      };
      setLogs(prev => [newLog, ...prev]);

      // ✅ Make.com Webhook Trigger
      triggerMakeEvent(WEBHOOK_EVENTS.TASK_COMPLETED, {
        taskId: taskId,
        taskName: activeTasks.find(t => t.id === taskId)?.name,
        result: res.message,
        timestamp: new Date().toISOString(),
        status: 'success'
      });
    }
  };

  const stopTask = async (taskId: string) => {
    const res = await automationApi.stopAutomation(taskId);
    if (res.success) {
      setActiveTasks(prev => prev.filter(t => t.id !== taskId));
      const newLog: AutomationLog = {
        id: `log-${Date.now()}`,
        taskId,
        timestamp: new Date().toLocaleString(),
        action: 'Stop Task',
        status: 'success',
        details: 'Task unscheduled and removed'
      };
      setLogs(prev => [newLog, ...prev]);
    }
  };

  const createAutomation = async () => {
    if (!newTask.name || !selectedTemplate) return;
    setDeploying(true);

    const config: AutomationConfig = {
      platform: (selectedTemplate.platforms[0].toLowerCase() as any) || 'instagram',
      action: selectedTemplate.type === 'engagement' ? 'like' : 'post',
      schedule: newTask.schedule,
      content: newTask.content,
      hashtags: ['automation', 'bdtoolx', 'neural']
    };

    // Use automationApi to create on backend
    const result = await automationApi.createAutomation({ type: selectedTemplate.type, config });

    const newTaskObj: AutomationTask = {
      id: result.task_id || `task-${Date.now()}`,
      name: newTask.name,
      type: selectedTemplate.type,
      status: 'active',
      schedule: newTask.schedule,
      lastRun: 'Never',
      nextRun: 'Scheduled',
      platform: config.platform.toUpperCase(),
      actions: 0,
      successRate: 100
    };

    setActiveTasks(prev => [newTaskObj, ...prev]);
    setDeploying(false);
    setIsCreating(false);
    setSelectedTemplate(null);
    setNewTask({ name: '', schedule: 'daily', content: '', platforms: [] });
    
    // Initial log
    setLogs(prev => [{
      id: `log-init-${Date.now()}`,
      taskId: newTaskObj.id,
      timestamp: new Date().toLocaleString(),
      action: 'Deployment',
      status: 'success',
      details: 'Neural node initialized successfully'
    }, ...prev]);
  };

  return (
    <div className="p-10 space-y-12 animate-in fade-in duration-300 overflow-y-auto h-[700px] custom-scrollbar bg-slate-50/20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-900 text-white rounded-[1.5rem] shadow-xl">
            <Bot size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Neural Automation</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${backendStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                {backendStatus.online ? `Engine Online (${backendStatus.tasks} Active Jobs)` : 'Engine Offline - Simulation Mode'}
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-2xl flex items-center gap-3"
        >
          <Zap size={18} fill="currentColor" /> Deploy New Bot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Bots', value: activeTasks.length, icon: <Play size={20}/>, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Queue Sync', value: backendStatus.online ? 'SYNCED' : 'OFFLINE', icon: <ActivityIcon size={20}/>, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Total Output', value: activeTasks.reduce((sum, t) => sum + t.actions, 0), icon: <RefreshCw size={20}/>, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Optimization', value: 'High', icon: <Zap size={20}/>, color: 'text-amber-500', bg: 'bg-amber-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl group hover:shadow-2xl transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:rotate-12 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 text-indigo-600">
          <FolderOpen size={20} />
          <h3 className="text-[11px] font-black uppercase tracking-widest">Automation Library</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AUTOMATION_TEMPLATES.map(template => (
            <div 
              key={template.id}
              onClick={() => { setSelectedTemplate(template); setIsCreating(true); }}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 ${template.bg} ${template.color} rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                  {template.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase">{template.name}</h4>
                  <p className="text-[10px] font-bold text-slate-500 mt-1">{template.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {template.platforms.map(p => <span key={p} className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-500 uppercase rounded-lg border border-slate-100">{p}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-emerald-600">
            <Zap size={20} />
            <h3 className="text-[11px] font-black uppercase tracking-widest">Active Automation Queue</h3>
          </div>
        </div>
        <div className="space-y-4">
          {activeTasks.length === 0 ? (
            <div className="bg-white p-12 rounded-[3.5rem] border border-dashed border-slate-200 text-center opacity-40">
              <Bot size={48} className="mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-[0.2em]">No active neural bots</p>
            </div>
          ) : activeTasks.map(task => (
            <div key={task.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl group">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl bg-emerald-500">
                    <Play size={24} fill="currentColor" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-black text-slate-900 uppercase">{task.name}</h4>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase rounded-lg">{task.type}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 mt-1">{task.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-6">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Schedule</p>
                    <p className="text-xs font-black text-slate-900 uppercase mt-1">{task.schedule}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => runTaskNow(task.id)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-md active:scale-90 hover:bg-blue-100 transition-colors" title="Run Now"><RefreshCw size={18} /></button>
                    <button onClick={() => stopTask(task.id)} className="p-4 bg-rose-50 text-rose-600 rounded-2xl shadow-md active:scale-90 hover:bg-rose-100 transition-colors" title="Stop & Delete"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 pb-12">
        <div className="flex items-center gap-3 text-slate-600">
          <FileText size={20} />
          <h3 className="text-[11px] font-black uppercase tracking-widest">Live Execution Logs</h3>
        </div>
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Time</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Action</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Status</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest">No logs recorded</td></tr>
              ) : logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4 text-[11px] font-bold text-slate-500">{log.timestamp}</td>
                  <td className="px-8 py-4 text-[11px] font-black text-slate-900 uppercase">{log.action}</td>
                  <td className="px-8 py-4"><span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full ${log.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{log.status}</span></td>
                  <td className="px-8 py-4 text-[11px] font-bold text-slate-400">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => !deploying && setIsCreating(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-10 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg"><Plus size={24}/></div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Bot Initialization</h3>
                  <p className="text-xs font-bold text-slate-400">Deploying real automation node.</p>
                </div>
              </div>
              <button onClick={() => setIsCreating(false)} disabled={deploying} className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-full shadow-md transition-all"><X size={24}/></button>
            </div>
            <div className="p-12 space-y-10">
              {selectedTemplate && (
                <div className="p-6 bg-indigo-50 rounded-[2rem] flex items-center gap-5">
                  <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm">{selectedTemplate.icon}</div>
                  <div>
                    <p className="text-xs font-black text-indigo-900 uppercase">{selectedTemplate.name}</p>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">{selectedTemplate.description}</p>
                  </div>
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2">Internal Ref Name</label>
                  <input type="text" value={newTask.name} onChange={(e) => setNewTask({...newTask, name: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm font-bold" placeholder="e.g. Daily Engagement Loop" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2">Frequency</label>
                  <select value={newTask.schedule} onChange={(e) => setNewTask({...newTask, schedule: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm">
                    <option value="hourly">Hourly Execution</option>
                    <option value="daily">Daily Execution</option>
                    <option value="custom">Aggressive (Every 5 mins)</option>
                  </select>
                </div>
                {selectedTemplate?.type === 'social' && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2">Seed Content</label>
                    <textarea value={newTask.content} onChange={(e) => setNewTask({...newTask, content: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm h-24" placeholder="Enter content theme for AI generation..." />
                  </div>
                )}
              </div>
              <button 
                onClick={createAutomation} 
                disabled={deploying}
                className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                {deploying ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                {deploying ? 'Establishing Node...' : 'Deploy Neural Bot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationSection;