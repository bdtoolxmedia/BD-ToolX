import React, { useState, useMemo } from 'react';
import { INITIAL_AFFILIATES } from '../constants';
import { AffiliateLink } from '../types';
import { 
  DollarSign, ExternalLink, MousePointer2, TrendingUp, 
  Plus, X, Zap, Wallet, ArrowRight, History, 
  CheckCircle2, AlertCircle, Clock, Send, ShieldCheck,
  TestTube, CreditCard, BadgeDollarSign
} from 'lucide-react';
import { triggerMakeEvent, WEBHOOK_EVENTS } from '../services/webhookService';

interface PayoutRecord {
  id: string;
  amount: number;
  date: string;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  txId: string;
}

const Affiliates: React.FC = () => {
  const [links, setLinks] = useState<AffiliateLink[]>(INITIAL_AFFILIATES);
  const [payoutHistory, setPayoutHistory] = useState<PayoutRecord[]>([
    { id: '1', amount: 120.00, date: '2026-01-15', method: 'PayPal', status: 'completed', txId: 'TXN-9821-X' },
    { id: '2', amount: 45.50, date: '2026-01-20', method: 'BTC', status: 'completed', txId: 'TXN-3342-N' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLink, setNewLink] = useState({ network: 'Amazon', product: '', url: '', useBitly: true });
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawMethod, setWithdrawMethod] = useState('PayPal');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalRevenue = useMemo(() => links.reduce((sum, item) => sum + item.revenue, 0), [links]);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    const link: AffiliateLink = {
      id: Math.random().toString(36).substr(2, 9),
      network: newLink.network,
      product: newLink.product,
      link: newLink.url,
      shortLink: newLink.useBitly ? `bit.ly/${Math.random().toString(36).substr(2, 6)}` : undefined,
      clicks: 0,
      revenue: 0
    };
    setLinks([link, ...links]);
    
    triggerMakeEvent(WEBHOOK_EVENTS.LINK_CREATED, {
      id: link.id,
      network: link.network,
      product: link.product,
      url: link.link,
      shortUrl: link.shortLink,
      timestamp: new Date().toISOString(),
      type: 'affiliate'
    });

    setNewLink({ network: 'Amazon', product: '', url: '', useBitly: true });
    setIsModalOpen(false);
  };

  const handleWithdraw = async (customAmt?: number) => {
    const finalAmount = customAmt || parseFloat(withdrawAmount);
    if (!finalAmount || finalAmount <= 0 || finalAmount > totalRevenue) {
      alert("Invalid withdrawal amount node.");
      return;
    }

    setIsProcessing(true);
    
    try {
      // ✅ 1. Trigger Payout Received Webhook (Request Phase)
      const txId = `txn_${Date.now()}`;
      triggerMakeEvent(WEBHOOK_EVENTS.PAYOUT_RECEIVED, {
        amount: finalAmount,
        currency: 'USD',
        method: withdrawMethod,
        status: 'requested',
        transactionId: txId,
        timestamp: new Date().toISOString(),
        userId: 'bdtoolx_admin'
      });

      // Simulate API latency
      await new Promise(r => setTimeout(r, 1500));

      // ✅ 2. Trigger Success Event
      triggerMakeEvent('withdrawal_successful', {
        amount: finalAmount,
        method: withdrawMethod,
        txId: txId,
        timestamp: new Date().toISOString()
      });

      const newRecord: PayoutRecord = {
        id: Math.random().toString(36).substr(2, 5),
        amount: finalAmount,
        date: new Date().toISOString().split('T')[0],
        method: withdrawMethod,
        status: 'pending',
        txId: txId
      };

      setPayoutHistory([newRecord, ...payoutHistory]);
      setWithdrawAmount('');
      alert(`✅ Neural Transfer Initiated: $${finalAmount} pushed to ${withdrawMethod} node.`);
    } catch (err: any) {
      triggerMakeEvent('withdrawal_failed', {
        amount: finalAmount,
        error: err.message,
        timestamp: new Date().toISOString()
      });
      alert("❌ Withdrawal Node Failure. Error logged to Make.com.");
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateIncomingPayout = () => {
    triggerMakeEvent(WEBHOOK_EVENTS.PAYOUT_RECEIVED, {
      amount: 45.50,
      currency: 'USD',
      method: 'Simulated Node',
      status: 'completed',
      transactionId: `sim_${Date.now()}`,
      note: 'Diagnostics: Neural Payout Simulation'
    });
    alert('Pulse Sent: Payout Received event transmitted to Make.com');
  };

  const sendManualUpdate = (payout: PayoutRecord) => {
    triggerMakeEvent('payout_status_update', {
      ...payout,
      timestamp: new Date().toISOString(),
      triggeredBy: 'manual_ui_override'
    });
    alert(`Syncing status for TX: ${payout.txId}`);
  };

  const testAllEvents = () => {
    triggerMakeEvent('test_all_events', {
      timestamp: new Date().toISOString(),
      source: 'Affiliates_Diagnostics_Module',
      active_links: links.length,
      revenue_pool: totalRevenue
    });
    alert('Global Diagnostic Handshake sent to Make.com');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">Affiliate Insights</h2>
          <div className="flex items-center gap-3 mt-3">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-[#EE6123] rounded-full text-[10px] font-black uppercase border border-orange-100 shadow-sm">
                <Zap size={12} fill="#EE6123" /> Bitly Node Active
             </div>
             <p className="text-slate-400 text-xs font-bold">Synchronized with Global Marketing Setups</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> New Link Fragment
          </button>
          
          <div className="bg-emerald-600 p-1.5 rounded-[2rem] flex items-center shadow-2xl">
             <div className="px-6 py-2">
                <p className="text-[9px] font-black uppercase text-emerald-200 tracking-widest opacity-80">Net Earnings</p>
                <p className="text-2xl font-black text-white tracking-tighter">${totalRevenue.toFixed(2)}</p>
             </div>
             <button 
               onClick={() => handleWithdraw(totalRevenue)}
               disabled={isProcessing || totalRevenue <= 0}
               className="p-4 bg-white text-emerald-600 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
             >
               <Wallet size={24} />
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Withdrawal & Management */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white rounded-[3.5rem] border border-slate-200 p-10 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <CreditCard size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Withdrawal Node</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select output vector and amount</p>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="grid grid-cols-3 gap-3">
                   {[50, 100, 200].map(amt => (
                     <button
                       key={amt}
                       onClick={() => handleWithdraw(amt)}
                       disabled={isProcessing || totalRevenue < amt}
                       className="py-4 rounded-2xl border-2 border-slate-100 font-black text-sm text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all disabled:opacity-30"
                     >
                       ${amt}
                     </button>
                   ))}
                 </div>

                 <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Custom Amount</label>
                      <input 
                        type="number" 
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 font-black text-lg outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Payout Method</label>
                      <select 
                        value={withdrawMethod}
                        onChange={(e) => setWithdrawMethod(e.target.value)}
                        className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 font-black text-xs uppercase tracking-widest outline-none cursor-pointer hover:bg-slate-100 transition-all"
                      >
                        <option>PayPal</option>
                        <option>Bitcoin (BTC)</option>
                        <option>Direct Bank</option>
                        <option>Payoneer</option>
                      </select>
                    </div>
                 </div>

                 <button 
                   onClick={() => handleWithdraw()}
                   disabled={isProcessing || !withdrawAmount}
                   className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {isProcessing ? <Clock className="animate-spin" size={18} /> : <BadgeDollarSign size={18} />}
                   {isProcessing ? 'SYNCHRONIZING...' : 'INITIALIZE TRANSFER'}
                 </button>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl space-y-8 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck size={100} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Make.com Bridge</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Integration Health: Stable</p>
              </div>
              <div className="space-y-3">
                 <button 
                   onClick={simulateIncomingPayout}
                   className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                 >
                   <TestTube size={14} className="text-indigo-400" /> Simulate Payout Event
                 </button>
                 <button 
                   onClick={testAllEvents}
                   className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                 >
                   <Zap size={14} className="text-emerald-400" /> Run All Diagnostic Pulse
                 </button>
              </div>
           </div>
        </div>

        {/* Right: History & Logs */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400">
                       <History size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Transfer Registry</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payout History & Webhook Log</p>
                    </div>
                 </div>
                 <div className="hidden sm:flex gap-2">
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100">Live Webhooks</span>
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-slate-50">
                         <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Binary Date</th>
                         <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                         <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vector</th>
                         <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                         <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Node Logic</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {payoutHistory.map((p) => (
                        <tr key={p.id} className="group hover:bg-slate-50/80 transition-all">
                           <td className="px-10 py-6">
                              <span className="text-xs font-black text-slate-900 uppercase">{p.date}</span>
                           </td>
                           <td className="px-10 py-6">
                              <span className="text-lg font-black text-slate-900 tracking-tighter">${p.amount.toFixed(2)}</span>
                           </td>
                           <td className="px-10 py-6">
                              <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-600 tracking-wider border border-slate-200">{p.method}</span>
                           </td>
                           <td className="px-10 py-6">
                              <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${p.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                 {p.status === 'completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                 {p.status}
                              </div>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <button 
                                onClick={() => sendManualUpdate(p)}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all active:scale-95 flex items-center gap-2 ml-auto"
                              >
                                <Send size={12} /> Force Sync
                              </button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {links.map((link) => (
               <div key={link.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                   <BadgeDollarSign size={80} className="text-slate-900" />
                 </div>
                 
                 <div className="flex items-center gap-4 mb-8">
                   <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl">
                     {link.network.charAt(0)}
                   </div>
                   <div>
                     <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{link.product}</h4>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{link.network}</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                       <MousePointer2 size={14} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Traffic Hits</span>
                     </div>
                     <p className="text-xl font-black text-slate-900 tracking-tighter">{link.clicks.toLocaleString()}</p>
                   </div>
                   <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                     <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
                       <DollarSign size={14} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Yield</span>
                     </div>
                     <p className="text-xl font-black text-indigo-700 tracking-tighter">${link.revenue.toFixed(2)}</p>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <div className="space-y-2">
                     {link.shortLink && (
                       <div className="text-[10px] font-black text-[#EE6123] flex items-center gap-1.5 uppercase tracking-widest bg-orange-50 w-fit px-3 py-1 rounded-lg border border-orange-100">
                         <Zap size={12} fill="#EE6123" /> {link.shortLink}
                       </div>
                     )}
                     <div className="text-[11px] font-bold text-slate-400 truncate bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all font-mono">
                       {link.link}
                     </div>
                   </div>
                   <button 
                     onClick={() => window.open(link.link, '_blank')}
                     className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3 shadow-lg group/btn"
                   >
                     <ExternalLink size={16} className="group-hover/btn:rotate-12 transition-transform" /> Visit Destination Node
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="bg-white rounded-[4rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-[4rem]">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl"><BadgeDollarSign size={24} /></div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Initialize Tracker</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add new affiliate fragment</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:bg-white hover:text-slate-900 rounded-full transition-all shadow-sm"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddLink} className="p-12 space-y-6">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Target Network</label>
                <select 
                  className="w-full p-5 rounded-2xl border border-slate-200 text-sm font-black uppercase bg-white outline-none focus:ring-8 focus:ring-indigo-500/5 transition-all cursor-pointer"
                  value={newLink.network}
                  onChange={(e) => setNewLink({...newLink, network: e.target.value})}
                >
                  <option>Amazon</option>
                  <option>Impact</option>
                  <option>ClickBank</option>
                  <option>DigiStore24</option>
                  <option>Custom Node</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Product Identifier</label>
                <input required type="text" className="w-full p-5 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-8 focus:ring-indigo-500/5 transition-all" placeholder="e.g. Neural Mic 2.0" value={newLink.product} onChange={(e) => setNewLink({...newLink, product: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Destination Link</label>
                <input required type="url" className="w-full p-5 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-8 focus:ring-indigo-500/5 transition-all" placeholder="https://amzn.to/..." value={newLink.url} onChange={(e) => setNewLink({...newLink, url: e.target.value})} />
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <input 
                   type="checkbox" 
                   checked={newLink.useBitly} 
                   onChange={(e) => setNewLink({...newLink, useBitly: e.target.checked})}
                   className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500/20"
                 />
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Auto-Initialize Bitly Node</span>
              </div>
              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95 mt-4">
                Establish Fragment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Affiliates;