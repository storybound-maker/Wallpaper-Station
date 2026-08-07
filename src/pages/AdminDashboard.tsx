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
  ImagePlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryName, ResolutionOption, OrientationType } from '../types';
import { CATEGORIES_DATA } from '../data/wallpapers';

export const AdminDashboard: React.FC = () => {
  const {
    wallpapers,
    addWallpaper,
    user,
    setUser,
    addToast
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
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Handle local device storage file selection
  const handleDeviceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file', 'error');
      return;
    }

    setSelectedFileName(file.name);
    if (!title) {
      // Auto fill title from filename
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
        addToast(`Loaded image "${file.name}" from device storage`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      addToast('Please provide a title and select or paste an image', 'error');
      return;
    }

    const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

    addWallpaper({
      title: title.trim(),
      description: description.trim() || 'A high definition wallpaper published via Wallpaper Station Admin Portal.',
      url: imageUrl.trim(),
      thumbnailUrl: imageUrl.trim(),
      category,
      resolutionTag,
      resolution,
      size: selectedFileName ? 'Local Storage File' : '5.6 MB',
      orientation,
      colorHex: ['#0B1220', '#38BDF8', '#818CF8'],
      colorName: 'Blue',
      tags: tagArray.length > 0 ? tagArray : [category, resolutionTag],
      author: {
        name: authorName.trim() || user.name || 'Station Creator',
        avatar: user.avatar,
      },
      aspectRatio: orientation === 'portrait' ? '9:16' : '16:9',
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setImageUrl('');
    setSelectedFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTags('Cyberpunk, 4K, Neon');
    addToast('New wallpaper published successfully to the site!', 'success');
  };

  const totalDownloads = wallpapers.reduce((acc, wp) => acc + wp.downloads, 184200);
  const totalViews = wallpapers.reduce((acc, wp) => acc + wp.views, 452100);

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Admin Suite Banner Header */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>CREATOR & UPLOAD PORTAL</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Upload Wallpapers</h1>
          <p className="text-slate-400 text-sm mt-1">
            Access your device storage to upload artwork and publish live to Wallpaper Station.
          </p>
        </div>

        {/* Toggle Admin Auth Status */}
        <button
          onClick={() => {
            setUser((prev) => ({ ...prev, isAdmin: !prev.isAdmin }));
            addToast(`Admin mode ${!user.isAdmin ? 'enabled' : 'disabled'}`, 'info');
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
            user.isAdmin
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}
        >
          {user.isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>{user.isAdmin ? 'Creator Mode Active' : 'Enable Creator Mode'}</span>
        </button>
      </div>

      {/* Analytics Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Wallpapers</span>
            <Layers className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{wallpapers.length + 15400}</p>
          <span className="text-[11px] text-emerald-400 font-semibold">+12 newly published</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Downloads</span>
            <Download className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalDownloads.toLocaleString()}</p>
          <span className="text-[11px] text-sky-400 font-semibold">+8.4% growth rate</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Views</span>
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalViews.toLocaleString()}</p>
          <span className="text-[11px] text-purple-400 font-semibold">4.8k views / day</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Storage Usage</span>
            <HardDrive className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">14.8 GB / 50 GB</p>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-400 h-full w-[30%]" />
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUploadSubmit} className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-700/80 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-sky-400" />
          <span>Upload & Publish Wallpaper Asset</span>
        </h2>

        {/* Device Storage File Picker Drop Zone */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase text-slate-300">
            Select Image From Device Storage *
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
                Supports PNG, JPG, WEBP, AVIF up to 8K resolution
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-[#0B1220] px-3 text-xs font-bold uppercase text-slate-500">OR PASTE URL</span>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Direct Image Web URL</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setSelectedFileName(null);
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
              onChange={(e) => setResolutionTag(e.target.value as ResolutionOption)}
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
        </div>

        {/* Live Preview Box */}
        {imageUrl.trim() && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 block">Live Selected Preview</span>
            <img
              src={imageUrl}
              alt="Upload preview"
              referrerPolicy="no-referrer"
              className="w-full h-56 object-cover rounded-xl"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-xl shadow-sky-500/20 transition-all hover:scale-[1.01]"
        >
          <Upload className="w-5 h-5" />
          <span>Publish Wallpaper to Station Database</span>
        </button>
      </form>
    </div>
  );
};
