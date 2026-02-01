import React from 'react';
import { INITIAL_CONTENT } from '../constants';
import { ContentStatus } from '../types';
import { Calendar, Clock, Sparkles, Send, CheckCircle2, History } from 'lucide-react';
import { generatePostContent } from '../services/geminiService';
import { triggerMakeEvent, WEBHOOK_EVENTS } from '../services/webhookService';

const ContentQueue: React.FC = () => {
  const [queue, setQueue] = React.useState(INITIAL_CONTENT);
  const [topic, setTopic] = React.useState('');
  const [platform, setPlatform] = React.useState('Twitter');
  const [generating, setGenerating] = React.useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setGenerating(true);
    const content = await generatePostContent(topic, platform);
    
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: content,
      platform,
      scheduledTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: ContentStatus.PENDING
    };
    
    setQueue([newItem, ...queue]);

    // ✅ Make.com Webhook Trigger
    triggerMakeEvent(WEBHOOK_EVENTS.CONTENT_POSTED, {
      id: newItem.id,
      platform: newItem.platform,
      topic: topic,
      text: newItem.text,
      scheduledTime: newItem.scheduledTime,
      timestamp: new Date().toISOString()
    });

    setTopic('');
    setGenerating(false);
  };

  const getStatusIcon = (status: ContentStatus) => {
    switch (status) {
      case ContentStatus.PENDING: return <Clock size={16} className="text-amber-500" />;
      case ContentStatus.SCHEDULED: return <Calendar size={16} className="text-blue-500" />;
      case ContentStatus.POSTED: return <CheckCircle2 size={16} className="text-emerald-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-indigo-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900">AI Content Generator</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Topic or Campaign</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What should the post be about?"
                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[120px] text-sm resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Target Platform</label>
              <select 
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-white"
              >
                <option>Twitter</option>
                <option>Instagram</option>
                <option>Facebook</option>
                <option>LinkedIn</option>
              </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={generating || !topic}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={20} />}
              Generate & Add to Queue
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <History className="text-slate-400" />
            Active Queue
          </h2>
          <span className="text-sm font-medium text-slate-500">{queue.length} posts queued</span>
        </div>

        <div className="space-y-4">
          {queue.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 uppercase">
                    {item.platform}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    {getStatusIcon(item.status)}
                    <span className="uppercase tracking-wider">{item.status}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {item.scheduledTime}
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                {item.text}
              </p>
              <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">Edit</button>
                <button className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2">
                  <Send size={14} />
                  Post Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentQueue;