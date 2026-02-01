import React, { useState, useRef, useEffect } from 'react';
import { 
  CloudUpload, Image as ImageIcon, Video, 
  Folder, Search, Plus, MoreVertical, 
  Download, Trash2, Layers, Grid, List, 
  Filter, Sparkles, HardDrive, Trash, AlertCircle,
  CheckCircle2, Loader2, Copy, Link as LinkIcon,
  DollarSign, Activity, PieChart, TrendingUp, BarChart3,
  Calendar, MousePointer2, Info, X, ShieldAlert, Clock,
  RefreshCw, Edit3, FolderInput, ArrowRightLeft,
  Ghost, FileText, ChevronRight, Home, FolderPlus
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'folder';
  size: string;
  date: string;
  url: string;
  fileCode?: string;
  downloads?: string;
  fldId?: string;
}

interface DeletedFile {
  file_code: string;
  name: string;
  deleted: string;
  deleted_ago_sec: string;
}

interface UploadyAccount {
  storage_left: string;
  balance: string;
  traffic_used: string;
  email: string;
  status: string;
}

interface UploadyStat {
  day: string;
  downloads: string;
  profit_total: string;
  views: string;
}

interface FileMetadata {
  status: number;
  filecode: string;
  name: string;
  download: string;
  size: string;
  uploaded: string;
}

interface FolderPathItem {
  name: string;
  id: string;
}

const MediaLibrary: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);
  const [accountInfo, setAccountInfo] = useState<UploadyAccount | null>(null);
  const [stats, setStats] = useState<UploadyStat[]>([]);
  const [selectedFileInfo, setSelectedFileInfo] = useState<FileMetadata | null>(null);
  const [renamingAsset, setRenamingAsset] = useState<Asset | null>(null);
  const [movingAsset, setMovingAsset] = useState<Asset | null>(null);
  const [deletedFiles, setDeletedFiles] = useState<DeletedFile[]>([]);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newNameInput, setNewNameInput] = useState('');
  const [folderIdInput, setFolderIdInput] = useState('');
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFetchingDeleted, setIsFetchingDeleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Folder Navigation State
  const [currentFolderId, setCurrentFolderId] = useState<string>('0');
  const [folderPath, setFolderPath] = useState<FolderPathItem[]>([{ name: 'Root', id: '0' }]);
  const [assets, setAssets] = useState<Asset[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upfilesToken = '643a0b5d1145e218ce161e86fe643bb0';
  const uploadyKey = '1saep52buejc4ngwo';

  const fetchUploadyData = async (fldId: string = currentFolderId) => {
    setIsSyncing(true);
    try {
      // Fetch Account Info
      const infoRes = await fetch(`https://uploady.io/api/account/info?key=${uploadyKey}`);
      const infoData = await infoRes.json();
      if (infoData.status === 200) {
        setAccountInfo({
          storage_left: infoData.result.storage_left,
          balance: infoData.result.balance,
          traffic_used: infoData.result.traffic_used,
          email: infoData.result.email,
          status: infoData.msg
        });
      }

      // Fetch Stats
      const statsRes = await fetch(`https://uploady.io/api/account/stats?key=${uploadyKey}&last=7`);
      const statsData = await statsRes.json();
      if (statsData.status === 200) {
        const formattedStats = statsData.result.map((s: any) => ({
          ...s,
          dayLabel: new Date(s.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        })).reverse();
        setStats(formattedStats);
      }

      // Fetch Folder/File List
      const folderRes = await fetch(`https://uploady.io/api/folder/list?key=${uploadyKey}&fld_id=${fldId}`);
      const folderData = await folderRes.json();
      
      if (folderData.status === 200) {
        const folderResults = folderData.result.folders.map((f: any) => ({
          id: f.fld_id,
          name: f.name,
          type: 'folder',
          size: '--',
          date: '--',
          url: '#',
          fldId: f.fld_id
        }));

        const fileResults = folderData.result.files.map((f: any) => ({
          id: f.file_code,
          name: f.name || 'Unnamed Fragment',
          type: f.name?.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'video',
          size: f.size ? `${(parseInt(f.size) / 1024 / 1024).toFixed(2)} MB` : '0 MB',
          date: f.uploaded ? new Date(f.uploaded).toLocaleDateString() : 'Unknown',
          url: f.link || `https://uploady.io/${f.file_code}`,
          fileCode: f.file_code,
          downloads: f.downloads || '0'
        }));

        setAssets([...folderResults, ...fileResults]);
      }
    } catch (error) {
      console.error('Failed to sync Uploady node:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setIsApiLoading(true);
    try {
      const response = await fetch(`https://uploady.io/api/folder/create?key=${uploadyKey}&parent_id=${currentFolderId}&name=${encodeURIComponent(newFolderName)}`);
      const data = await response.json();
      
      if (data.status === 200) {
        setShowCreateFolderModal(false);
        setNewFolderName('');
        fetchUploadyData(currentFolderId);
        alert('Directory Node Synthesized Successfully');
      } else {
        alert(`Synthesis Error: ${data.msg}`);
      }
    } catch (error) {
      console.error('Folder creation failed:', error);
    } finally {
      setIsApiLoading(false);
    }
  };

  const navigateToFolder = (fldId: string, fldName: string) => {
    setCurrentFolderId(fldId);
    if (fldId === '0') {
      setFolderPath([{ name: 'Root', id: '0' }]);
    } else {
      const existingIdx = folderPath.findIndex(p => p.id === fldId);
      if (existingIdx !== -1) {
        setFolderPath(folderPath.slice(0, existingIdx + 1));
      } else {
        setFolderPath([...folderPath, { name: fldName, id: fldId }]);
      }
    }
    fetchUploadyData(fldId);
  };

  const fetchDeletedFiles = async () => {
    setIsFetchingDeleted(true);
    setShowTrashModal(true);
    try {
      const response = await fetch(`https://uploady.io/api/files/deleted?key=${uploadyKey}&last=20`);
      const data = await response.json();
      if (data.status === 200) {
        setDeletedFiles(data.result || []);
      }
    } catch (error) {
      console.error('Failed to fetch deleted fragments:', error);
    } finally {
      setIsFetchingDeleted(false);
    }
  };

  useEffect(() => {
    fetchUploadyData();
  }, []);

  const getFileInfo = async (fileCode: string) => {
    setFetchingInfo(true);
    try {
      const response = await fetch(`https://uploady.io/api/file/info?key=${uploadyKey}&file_code=${fileCode}`);
      const data = await response.json();
      if (data.status === 200 && data.result && data.result.length > 0) {
        setSelectedFileInfo(data.result[0]);
      } else {
        alert('Node response: 404 - File Fragment Missing');
      }
    } catch (error) {
      console.error('Metadata Fetch Error:', error);
    } finally {
      setFetchingInfo(false);
    }
  };

  const handleRename = async () => {
    if (!renamingAsset || !newNameInput.trim()) return;
    setIsApiLoading(true);
    try {
      let endpoint = '';
      if (renamingAsset.type === 'folder') {
        // Folder Rename Endpoint: api/folder/rename?key=key&fld_id=fld_id&name=name
        endpoint = `https://uploady.io/api/folder/rename?key=${uploadyKey}&fld_id=${renamingAsset.fldId}&name=${encodeURIComponent(newNameInput)}`;
      } else {
        // File Rename Endpoint: api/file/rename?key=key&file_code=file_code&name=name
        endpoint = `https://uploady.io/api/file/rename?key=${uploadyKey}&file_code=${renamingAsset.fileCode}&name=${encodeURIComponent(newNameInput)}`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();
      if (data.status === 200) {
        setRenamingAsset(null);
        fetchUploadyData(currentFolderId);
      } else {
        alert(`Neural Failure: ${data.msg}`);
      }
    } catch (error) {
      console.error('Rename error:', error);
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleSetFolder = async () => {
    if (!movingAsset || !folderIdInput.trim()) return;
    setIsApiLoading(true);
    try {
      const response = await fetch(`https://uploady.io/api/file/set_folder?key=${uploadyKey}&file_code=${movingAsset.fileCode}&fld_id=${folderIdInput}`);
      const data = await response.json();
      if (data.status === 200) {
        setMovingAsset(null);
        setFolderIdInput('');
        fetchUploadyData(currentFolderId);
        alert('Node Reassigned Successfully');
      } else {
        alert(`Neural Failure: ${data.msg}`);
      }
    } catch (error) {
      console.error('Folder set error:', error);
    } finally {
      setIsApiLoading(false);
    }
  };

  const startRenaming = (asset: Asset) => {
    setRenamingAsset(asset);
    setNewNameInput(asset.name);
  };

  const startMoving = (asset: Asset) => {
    setMovingAsset(asset);
    setFolderIdInput('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('token', upfilesToken);
    formData.append('file', file);

    try {
      const response = await fetch('https://api.upfiles.com/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      if (result.status === 'success') {
        fetchUploadyData(currentFolderId);
      }
    } catch (error) {
      console.error('Upload Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const filteredAssets = assets.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalDownloads = stats.reduce((sum, s) => sum + parseInt(s.downloads), 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Media Vault</h1>
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] mt-3">Multi-Node Analytics • Performance Command</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowCreateFolderModal(true)}
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-400 hover:text-indigo-600 transition-all group"
            title="Create New Directory"
          >
            <FolderPlus size={18} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={fetchDeletedFiles}
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-400 hover:text-rose-500 transition-all group"
            title="View Deleted Fragments"
          >
            <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => fetchUploadyData()}
            disabled={isSyncing}
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-600 hover:text-indigo-600 transition-all active:rotate-180 duration-500"
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] shadow-2xl hover:bg-black transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <CloudUpload size={18} />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deploy Binary</span>
          </button>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[4rem] border border-slate-100 p-10 shadow-2xl relative overflow-hidden">
           <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
                   <TrendingUp size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Profit Trajectory</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">7-Day Revenue Cycle</p>
                </div>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Earnings</p>
                 <h4 className="text-2xl font-black text-emerald-500 tracking-tighter">${accountInfo?.balance || '0.00'}</h4>
              </div>
           </div>

           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={stats}>
                    <defs>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="dayLabel" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 900 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="profit_total" 
                      stroke="#10b981" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorProfit)" 
                      animationDuration={1500}
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[3.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <Download size={100} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Downloads</p>
              <h3 className="text-4xl font-black mt-2 tracking-tighter">{totalDownloads.toLocaleString()}</h3>
              <div className="mt-6 flex items-center gap-3">
                 <div className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-400">
                    +12% vs last week
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[3.5rem] p-8 border border-slate-100 shadow-xl group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Node</p>
              <div className="flex items-center gap-3 mt-3">
                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black uppercase">
                    {accountInfo?.email?.charAt(0) || 'U'}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900 truncate max-w-[150px]">{accountInfo?.email || 'Not Connected'}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{accountInfo?.status === 'OK' ? 'Verified Node' : 'Syncing...'}</span>
                 </div>
              </div>
              <div className="mt-8 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Traffic Usage</span>
                    <span className="text-[10px] font-black text-slate-900 uppercase">{accountInfo?.traffic_used || '0'}MB</span>
                 </div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[45%]" />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Asset Explorer */}
      <div className="bg-white rounded-[4.5rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        {/* Navigation Breadcrumbs */}
        <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center gap-2 overflow-x-auto custom-scrollbar no-scrollbar">
          {folderPath.map((path, idx) => (
            <React.Fragment key={path.id}>
              <button 
                onClick={() => navigateToFolder(path.id, path.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${idx === folderPath.length - 1 ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                {path.id === '0' ? <Home size={14} /> : null}
                {path.name}
              </button>
              {idx < folderPath.length - 1 && <ChevronRight size={14} className="text-slate-200 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search server fragments..." 
              className="w-full pl-20 pr-8 py-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm outline-none font-bold text-xs uppercase tracking-widest focus:ring-8 focus:ring-slate-900/5 transition-all" 
            />
          </div>
          <div className="flex items-center gap-4">
             <div className="flex gap-1 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <button onClick={() => setView('grid')} className={`p-3.5 rounded-xl transition-all ${view === 'grid' ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-slate-50'}`}><Grid size={20} /></button>
                <button onClick={() => setView('list')} className={`p-3.5 rounded-xl transition-all ${view === 'list' ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-slate-50'}`}><List size={20} /></button>
             </div>
          </div>
        </div>

        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
          {isSyncing ? (
            <div className="h-96 flex flex-col items-center justify-center gap-6 opacity-30">
               <Loader2 size={64} className="animate-spin text-slate-400" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em]">Synchronizing Node State...</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center gap-6 opacity-30">
               <Folder size={64} className="text-slate-400" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Entities Found in Directory</p>
            </div>
          ) : (
            <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10" : "space-y-4"}>
              {filteredAssets.map(asset => (
                <div key={asset.id} className={view === 'grid' ? "bg-slate-50 rounded-[3.5rem] border border-slate-100 overflow-hidden group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:bg-white transition-all duration-700" : "bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all"}>
                  {view === 'grid' ? (
                    <>
                      <div className="aspect-square relative overflow-hidden bg-slate-200">
                        <div 
                          className={`w-full h-full flex items-center justify-center bg-slate-100 transition-colors ${asset.type === 'folder' ? 'bg-indigo-50 text-indigo-200 group-hover:bg-indigo-100' : 'text-slate-300'}`}
                          onClick={() => asset.type === 'folder' && navigateToFolder(asset.fldId!, asset.name)}
                          style={{ cursor: asset.type === 'folder' ? 'pointer' : 'default' }}
                        >
                          {asset.type === 'folder' ? <Folder size={64} fill="currentColor" /> : asset.type === 'image' ? <ImageIcon size={48} /> : <Video size={48} />}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                              {asset.type !== 'folder' && (
                                <>
                                  <button onClick={() => { navigator.clipboard.writeText(asset.url); alert('Link Copied!'); }} className="p-3 bg-white text-slate-900 rounded-xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                                    <Copy size={18} />
                                  </button>
                                  <button onClick={() => startMoving(asset)} className="p-3 bg-white text-blue-600 rounded-xl shadow-2xl hover:scale-110 active:scale-95 transition-all" title="Move to Folder">
                                    <FolderInput size={18} />
                                  </button>
                                  <button onClick={() => startRenaming(asset)} className="p-3 bg-white text-emerald-600 rounded-xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                                    <Edit3 size={18} />
                                  </button>
                                  <button onClick={() => getFileInfo(asset.fileCode!)} className="p-3 bg-white text-indigo-600 rounded-xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                                    <Info size={18} />
                                  </button>
                                </>
                              )}
                              {asset.type === 'folder' && (
                                <>
                                  <button onClick={() => navigateToFolder(asset.fldId!, asset.name)} className="px-6 py-3 bg-white text-indigo-600 rounded-xl shadow-2xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all">
                                    Open Node
                                  </button>
                                  <button onClick={() => startRenaming(asset)} className="p-3 bg-white text-emerald-600 rounded-xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                                    <Edit3 size={18} />
                                  </button>
                                </>
                              )}
                          </div>
                        </div>
                        {asset.type !== 'folder' && (
                          <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase text-white tracking-widest">
                            {asset.downloads || '0'} HITS
                          </div>
                        )}
                      </div>
                      <div className="p-8">
                        <h4 className="text-xs font-black text-slate-900 truncate uppercase tracking-tighter">{asset.name}</h4>
                        <div className="flex justify-between items-center mt-5">
                          <div className="flex flex-col">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{asset.type === 'folder' ? 'Entity Type' : 'Fragment Size'}</span>
                              <span className="text-[10px] font-black text-slate-900 mt-0.5 uppercase">{asset.type === 'folder' ? 'Directory' : asset.size}</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-300 uppercase">{asset.date}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-6 cursor-pointer" onClick={() => asset.type === 'folder' && navigateToFolder(asset.fldId!, asset.name)}>
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${asset.type === 'folder' ? 'bg-indigo-50 text-indigo-400' : 'bg-slate-50 text-slate-400'}`}>
                            {asset.type === 'folder' ? <Folder size={20} fill="currentColor" /> : asset.type === 'image' ? <ImageIcon size={20} /> : <Video size={20} />}
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase">{asset.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                              {asset.type === 'folder' ? `Directory Node: ${asset.fldId}` : `${asset.fileCode} • ${asset.size}`}
                            </p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         {asset.type !== 'folder' && (
                           <div className="text-right mr-4">
                              <p className="text-[10px] font-black text-slate-900 uppercase">{asset.downloads || '0'} Hits</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{asset.date}</p>
                           </div>
                         )}
                         {asset.type === 'folder' ? (
                           <>
                             <button onClick={() => startRenaming(asset)} className="p-3 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><Edit3 size={20} /></button>
                             <button onClick={() => navigateToFolder(asset.fldId!, asset.name)} className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><ChevronRight size={20} /></button>
                           </>
                         ) : (
                           <>
                             <button onClick={() => startMoving(asset)} className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><FolderInput size={20} /></button>
                             <button onClick={() => startRenaming(asset)} className="p-3 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><Edit3 size={20} /></button>
                             <button onClick={() => getFileInfo(asset.fileCode!)} className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Info size={20} /></button>
                             <button className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                           </>
                         )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden relative border border-slate-100">
             <div className="p-10 bg-indigo-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl"><FolderPlus size={28} /></div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Directory Synthesis</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Initializing New Storage Node</p>
                  </div>
                </div>
                <button onClick={() => setShowCreateFolderModal(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                  <X size={24} />
                </button>
             </div>
             <div className="p-10 space-y-8">
                <div className="space-y-2">
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Folder Label Matrix</label>
                   <input 
                      type="text" 
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="w-full p-6 rounded-[2rem] bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 outline-none focus:ring-8 focus:ring-indigo-500/5 transition-all shadow-inner"
                      placeholder="e.g. Marketing Fragments"
                      autoFocus
                   />
                </div>
                <div className="flex gap-4">
                   <button 
                      onClick={() => setShowCreateFolderModal(false)}
                      className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                   >
                      Abort
                   </button>
                   <button 
                      onClick={handleCreateFolder}
                      disabled={isApiLoading || !newFolderName.trim()}
                      className="flex-[2] py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                   >
                      {isApiLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                      Initialize Node
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Deleted Files Modal */}
      {showTrashModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden relative border border-slate-100 flex flex-col max-h-[80vh]">
             <div className="p-10 bg-rose-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl shadow-lg"><Ghost size={28} /></div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Decommissioned Assets</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Viewing last 20 deleted fragments</p>
                  </div>
                </div>
                <button onClick={() => setShowTrashModal(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                  <X size={24} />
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-10 space-y-4 custom-scrollbar">
                {isFetchingDeleted ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
                    <Loader2 size={48} className="animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Querying Archive Node...</p>
                  </div>
                ) : deletedFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
                    <Trash size={48} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Archive is Empty</p>
                  </div>
                ) : (
                  deletedFiles.map(file => (
                    <div key={file.file_code} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl text-slate-300 group-hover:text-rose-400 transition-colors shadow-sm">
                           <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase truncate max-w-[200px]">{file.name}</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{file.file_code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-900 uppercase">{new Date(file.deleted).toLocaleDateString()}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{file.deleted_ago_sec} SEC AGO</p>
                      </div>
                    </div>
                  ))
                )}
             </div>

             <div className="p-10 border-t border-slate-100 bg-slate-50/50">
               <button 
                  onClick={() => setShowTrashModal(false)}
                  className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
               >
                 Close Archive Access
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Move Folder Modal */}
      {movingAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden relative border border-slate-100">
             <div className="p-10 bg-blue-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl"><FolderInput size={28} /></div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Transfer Terminal</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Reassigning Asset Directory</p>
                  </div>
                </div>
                <button onClick={() => setMovingAsset(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                  <X size={24} />
                </button>
             </div>
             <div className="p-10 space-y-8">
                <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                      {movingAsset.type === 'image' ? <ImageIcon size={20} /> : <Video size={20} />}
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Node</p>
                      <h4 className="text-xs font-black text-slate-900 truncate uppercase">{movingAsset.name}</h4>
                   </div>
                   <ArrowRightLeft className="text-blue-400" size={20} />
                </div>

                <div className="space-y-2">
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Target Folder ID</label>
                   <input 
                      type="number" 
                      value={folderIdInput}
                      onChange={(e) => setFolderIdInput(e.target.value)}
                      className="w-full p-6 rounded-[2rem] bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 outline-none focus:ring-8 focus:ring-blue-500/5 transition-all shadow-inner"
                      placeholder="e.g. 15"
                   />
                </div>

                <div className="flex gap-4">
                   <button 
                      onClick={() => setMovingAsset(null)}
                      className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                   >
                      Abort
                   </button>
                   <button 
                      onClick={handleSetFolder}
                      disabled={isApiLoading || !folderIdInput.trim()}
                      className="flex-[2] py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                   >
                      {isApiLoading ? <Loader2 size={18} className="animate-spin" /> : <FolderInput size={18} />}
                      Reassign Node
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renamingAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden relative border border-slate-100">
             <div className="p-10 bg-emerald-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl"><Edit3 size={28} /></div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Rename Fragment</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Synthesizing New Label</p>
                  </div>
                </div>
                <button onClick={() => setRenamingAsset(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                  <X size={24} />
                </button>
             </div>
             <div className="p-10 space-y-8">
                <div>
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Current Entity Name</label>
                   <p className="px-6 py-3 bg-slate-50 rounded-2xl text-xs font-bold text-slate-500 truncate border border-slate-100">{renamingAsset.name}</p>
                </div>

                <div className="space-y-2">
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">New Identity Matrix</label>
                   <input 
                      type="text" 
                      value={newNameInput}
                      onChange={(e) => setNewNameInput(e.target.value)}
                      className="w-full p-6 rounded-[2rem] bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 uppercase tracking-tighter outline-none focus:ring-8 focus:ring-emerald-500/5 transition-all shadow-inner"
                      placeholder="Enter new filename..."
                   />
                </div>

                <div className="flex gap-4">
                   <button 
                      onClick={() => setRenamingAsset(null)}
                      className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                   >
                      Abort
                   </button>
                   <button 
                      onClick={handleRename}
                      disabled={isApiLoading || !newNameInput.trim()}
                      className="flex-[2] py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                   >
                      {isApiLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                      Update Node
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Metadata Inspector Modal */}
      {selectedFileInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden relative border border-slate-100">
             <div className="p-10 bg-indigo-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl"><ShieldAlert size={28} /></div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Neural Metadata</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Uploady Server Fragment info</p>
                  </div>
                </div>
                <button onClick={() => setSelectedFileInfo(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                  <X size={24} />
                </button>
             </div>
             <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status Code</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${selectedFileInfo.status === 200 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="font-black text-slate-900">{selectedFileInfo.status} {selectedFileInfo.status === 200 ? '(Active)' : '(Missing)'}</span>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">File Code</p>
                      <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{selectedFileInfo.filecode}</span>
                   </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Original Filename</p>
                   <h4 className="text-sm font-black text-slate-900 uppercase leading-relaxed">{selectedFileInfo.name || 'Unknown'}</h4>
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div className="text-center p-4 bg-slate-50 rounded-2xl">
                      <Download size={18} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-[10px] font-black text-slate-900">{selectedFileInfo.download || '0'}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Hits</p>
                   </div>
                   <div className="text-center p-4 bg-slate-50 rounded-2xl">
                      <HardDrive size={18} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-[10px] font-black text-slate-900">{(parseInt(selectedFileInfo.size) / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Size</p>
                   </div>
                   <div className="text-center p-4 bg-slate-50 rounded-2xl">
                      <Clock size={18} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-[10px] font-black text-slate-900 truncate">{selectedFileInfo.uploaded ? selectedFileInfo.uploaded.split(' ')[0] : 'N/A'}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Born</p>
                   </div>
                </div>

                <button 
                  onClick={() => setSelectedFileInfo(null)}
                  className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                >
                  Close Terminal
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Fetching Overlay */}
      {fetchingInfo && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/40 backdrop-blur-md">
           <div className="flex flex-col items-center gap-4">
              <Loader2 size={48} className="animate-spin text-indigo-600" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Querying Server Node...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;