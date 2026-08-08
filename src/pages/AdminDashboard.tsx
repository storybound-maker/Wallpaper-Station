import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Upload,
  Layers,
  Eye,
  Download,
  HardDrive,
  Lock,
  Unlock,
  CheckCircle2,
  FolderOpen,
  Database,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  Trash2,
  Sparkles,
  Server,
  CloudUpload,
  Loader2,
  Key,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryName, ResolutionOption, OrientationType } from '../types';
import { CATEGORIES_DATA } from '../data/wallpapers';
import { SUPABASE_SQL_SCHEMA, getSupabaseConfig, resetSupabaseClientInstance } from '../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const {
    wallpapers,
    addWallpaper,
    uploadWallpaperWithFile,
    deleteWallpaper,
    user,
    setUser,
    addToast,
    isSupabaseConnected,
    isLoadingWallpapers,
    wallpaperError,
    seedSupabaseDatabase,
    refetchWallpapers
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<CategoryName>('Cyberpunk');
  const [resolutionTag, setResolutionTag] = useState<ResolutionOption>('4K');
  const [resolution, setResolution] = useState('3840 x 2160');
  const [orientation, setOrientation] = useState<OrientationType>('landscape');
  const [tags, setTags] = useState('Cyberpunk, 4K, Neon, City');
  const [authorName, setAuthorName] = useState(user.name);
  const [colorHexStr, setColorHexStr] = useState('#0B1220, #38BDF8, #818CF8');
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Loading & Helper States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Custom Supabase keys input
  const currentConfig = getSupabaseConfig();
  const [customUrlInput, setCustomUrlInput] = useState(currentConfig.url);
  const [customKeyInput, setCustomKeyInput] = useState(currentConfig.key);

  const handleSaveCustomKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      localStorage.setItem('ws_supabase_url', customUrlInput.trim());
    } else {
      localStorage.removeItem('ws_supabase_url');
    }

    if (customKeyInput.trim()) {
      localStorage.setItem('ws_supabase_key', customKeyInput.trim());
    } else {
      localStorage.removeItem('ws_supabase_key');
    }

    resetSupabaseClientInstance();
    refetchWallpapers();
    addToast('Updated Supabase client credentials!', 'success');
    setShowKeyConfig(false);
  };

  // Handle file selection from device
  const handleDeviceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, WEBP, AVIF)', 'error');
      return;
    }

    setSelectedFile(file);
    setSelectedFileName(file.name);

    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewUrl(event.target.result as string);
        setImageUrl(''); // Clear manual URL if file selected
        addToast(`Image "${file.name}" selected for Supabase Storage upload`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    addToast('Supabase SQL schema copied to clipboard!', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      await seedSupabaseDatabase();
    } finally {
      setIsSeeding(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Please enter a wallpaper title', 'error');
      return;
    }

    if (!selectedFile && !imageUrl.trim()) {
      addToast('Please select an image file to upload or paste an image URL', 'error');
      return;
    }

    const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const colorArray = colorHexStr.split(',').map((c) => c.trim()).filter(Boolean);

    const metadata = {
      title: title.trim(),
      description: description.trim() || 'A high definition wallpaper stored in Supabase.',
      category,
      resolutionTag,
      resolution,
      size: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '5.6 MB',
      orientation,
      colorHex: colorArray.length > 0 ? colorArray : ['#0B1220', '#38BDF8', '#818CF8'],
      colorName: 'Blue',
      tags: tagArray.length > 0 ? tagArray : [category, resolutionTag],
      author: {
        name: authorName.trim() || user.name || 'Station Creator',
        avatar: user.avatar,
      },
      aspectRatio: orientation === 'portrait' ? '9:16' : '16:9',
    };

    setIsSubmitting(true);

    try {
      if (selectedFile) {
        // Upload file to Supabase Storage 'wallpapers' bucket & save metadata to 'wallpapers' table
        await uploadWallpaperWithFile(selectedFile, metadata);
      } else {
        // Save image URL to Supabase database table
        await addWallpaper({
          ...metadata,
          url: imageUrl.trim(),
          thumbnailUrl: imageUrl.trim(),
        });
      }

      // Reset Form
      setTitle('');
      setDescription('');
      setImageUrl('');
      setSelectedFile(null);
      setSelectedFileName(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTags('Cyberpunk, 4K, Neon');
    } catch (err: any) {
      console.error('Upload error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalDownloads = wallpapers.reduce((acc, wp) => acc + wp.downloads, 0);
  const totalViews = wallpapers.reduce((acc, wp) => acc + wp.views, 0);

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Admin Suite Banner Header */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>SUPABASE ADMIN & UPLOAD PORTAL</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Wallpaper Admin Hub</h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload images directly to Supabase Storage and manage metadata in the PostgreSQL database.
          </p>
        </div>

        {/* Toggle Admin Mode */}
        <button
          onClick={() => {
            setUser((prev) => ({ ...prev, isAdmin: !prev.isAdmin }));
            addToast(`Admin mode ${!user.isAdmin ? 'enabled' : 'disabled'}`, 'info');
          }}
          className={`relative z-10 px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
            user.isAdmin
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}
        >
          {user.isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>{user.isAdmin ? 'Admin Mode Active' : 'Enable Admin Mode'}</span>
        </button>
      </div>

      {/* Supabase Status Banner & Database Control Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isSupabaseConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Supabase Integration Status</h3>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isSupabaseConnected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {isSupabaseConnected ? 'Connected & Live' : 'Local Backup Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSupabaseConnected
                  ? 'Connected to Supabase PostgreSQL Database & Storage Bucket "wallpapers"'
                  : 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="px-4 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 border border-indigo-500/40 transition-all shadow-md shadow-indigo-500/10 disabled:opacity-50"
            >
              {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-300" />}
              <span>Seed Initial Data</span>
            </button>

            <button
              onClick={() => refetchWallpapers()}
              disabled={isLoadingWallpapers}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWallpapers ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-2 border border-amber-500/20 transition-all"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{showKeyConfig ? 'Hide Keys Setup' : 'Configure Supabase Keys'}</span>
            </button>

            <button
              onClick={() => setShowSqlSchema(!showSqlSchema)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs flex items-center gap-2 border border-sky-500/20 transition-all"
            >
              <Server className="w-3.5 h-3.5" />
              <span>{showSqlSchema ? 'Hide SQL Setup' : 'View SQL Setup'}</span>
            </button>
          </div>
        </div>

        {/* Custom Key Config Drawer */}
        {showKeyConfig && (
          <form onSubmit={handleSaveCustomKeys} className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Key className="w-4 h-4" /> Supabase Connection Credentials
              </span>
              <span className="text-[10px] text-slate-400">Stored locally in browser state</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  VITE_SUPABASE_URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  VITE_SUPABASE_ANON_KEY
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={customKeyInput}
                  onChange={(e) => setCustomKeyInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-slate-400">
                You can also configure <code className="text-amber-300">.env</code> or environment variables.
              </p>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 transition-colors"
              >
                Save Credentials
              </button>
            </div>
          </form>
        )}

        {/* Database Warning Notice if table missing */}
        {wallpaperError && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300">Supabase Table / Bucket Notice</p>
              <p className="mt-1 text-slate-300">{wallpaperError}</p>
              <p className="mt-1.5 text-slate-400">
                Click <strong>"View SQL Setup"</strong> below to copy the SQL query for your Supabase SQL Editor.
              </p>
            </div>
          </div>
        )}

        {/* SQL Schema Copy Drawer */}
        {showSqlSchema && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Server className="w-4 h-4" /> Supabase Database Schema & Storage Setup
              </span>
              <button
                onClick={handleCopySql}
                className="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold text-xs flex items-center gap-1.5 border border-sky-500/30 transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 bg-slate-900/90 p-4 rounded-xl overflow-x-auto max-h-60 border border-slate-800 leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        )}
      </div>

      {/* Analytics Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Database Items</span>
            <Layers className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{wallpapers.length}</p>
          <span className="text-[11px] text-emerald-400 font-semibold">Loaded from Supabase</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Downloads</span>
            <Download className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalDownloads.toLocaleString()}</p>
          <span className="text-[11px] text-sky-400 font-semibold">Tracked in database</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Views</span>
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalViews.toLocaleString()}</p>
          <span className="text-[11px] text-purple-400 font-semibold">Station Analytics</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Storage Bucket</span>
            <HardDrive className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">wallpapers</p>
          <span className="text-[11px] text-teal-400 font-semibold">Public Supabase Bucket</span>
        </div>
      </div>

      {/* Admin Upload Form */}
      {!user.isAdmin ? (
        <div className="glass-panel rounded-3xl p-8 border border-amber-500/30 text-center space-y-4">
          <Lock className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Creator Mode Required</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Upload permission is restricted to admin creators. Enable Creator Mode at the top right to access the upload form.
          </p>
        </div>
      ) : (
        <form onSubmit={handleUploadSubmit} className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-700/80 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CloudUpload className="w-5 h-5 text-sky-400" />
              <span>Upload Wallpaper to Supabase Storage & Database</span>
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Admin Upload System
            </span>
          </div>

          {/* Supabase Storage File Picker Drop Zone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-slate-300">
              Select Image File for Supabase Storage *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-2xl p-8 text-center bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition-all duration-300 group space-y-3"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleDeviceFileSelect}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <FolderOpen className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {selectedFileName ? (
                    <span className="text-emerald-400 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Selected: {selectedFileName}
                    </span>
                  ) : (
                    'Click to browse device storage or photos'
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Uploads directly to Supabase Storage bucket <code className="text-sky-300">"wallpapers"</code>
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-[#0B1220] px-3 text-xs font-bold uppercase text-slate-500">OR PROVIDE DIRECT IMAGE URL</span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Direct Image Web URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setSelectedFile(null);
                setSelectedFileName(null);
                setPreviewUrl(e.target.value);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Wallpaper Title *</label>
              <input
                type="text"
                required
                placeholder="e.g., Neon Rain Samurai 4K"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Author / Creator Name</label>
              <input
                type="text"
                placeholder="Your name or handle"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Description</label>
              <textarea
                rows={2}
                placeholder="Describe the mood, color tones, or screen setup fit..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryName)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {CATEGORIES_DATA.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Target Resolution *</label>
              <select
                value={resolutionTag}
                onChange={(e) => {
                  const tag = e.target.value as ResolutionOption;
                  setResolutionTag(tag);
                  if (tag === '8K') setResolution('7680 x 4320');
                  else if (tag === '4K') setResolution('3840 x 2160');
                  else if (tag === '1440p') setResolution('2560 x 1440');
                  else if (tag === '1080p') setResolution('1920 x 1080');
                  else if (tag === 'Mobile') setResolution('1290 x 2796');
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="4K">4K (3840 x 2160)</option>
                <option value="8K">8K (7680 x 4320)</option>
                <option value="1440p">1440p (2560 x 1440)</option>
                <option value="1080p">1080p (1920 x 1080)</option>
                <option value="Mobile">Mobile (1290 x 2796)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as OrientationType)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="landscape">Landscape (Desktop / Monitor)</option>
                <option value="portrait">Portrait (Mobile / Phone)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Tags (Comma Separated)</label>
              <input
                type="text"
                placeholder="e.g., Cyberpunk, Neon, 4K, Dark"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Color Palette Hex Codes (Comma Separated)</label>
              <input
                type="text"
                placeholder="#0B1220, #38BDF8, #818CF8"
                value={colorHexStr}
                onChange={(e) => setColorHexStr(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          {previewUrl && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 block">Selected Image Preview</span>
              <img
                src={previewUrl}
                alt="Upload preview"
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover rounded-xl"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-xl shadow-sky-500/20 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading to Supabase Storage & Database...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Publish Wallpaper to Supabase</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Database Inventory Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Database Wallpapers Inventory ({wallpapers.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Live Supabase Sync</span>
        </div>

        <div className="divide-y divide-slate-800/60 overflow-x-auto">
          {wallpapers.map((wp) => (
            <div key={wp.id} className="py-3.5 flex items-center justify-between gap-4 min-w-[600px]">
              <div className="flex items-center gap-3">
                <img
                  src={wp.thumbnailUrl || wp.url}
                  alt={wp.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{wp.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="text-sky-400 font-semibold">{wp.category}</span>
                    <span>•</span>
                    <span>{wp.resolutionTag}</span>
                    <span>•</span>
                    <span>{wp.author?.name || 'Creator'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right text-xs text-slate-400">
                  <p className="font-mono text-slate-200">{wp.downloads} downloads</p>
                  <p className="text-[10px] text-slate-500">{wp.uploadDate}</p>
                </div>

                <button
                  onClick={() => deleteWallpaper(wp.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                  title="Delete wallpaper"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
