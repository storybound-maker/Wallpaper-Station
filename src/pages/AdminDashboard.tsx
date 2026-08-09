import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  CloudUpload,
  Upload,
  Trash2,
  Pencil,
  X,
  Save,
  FolderOpen,
  CheckCircle2,
  Layers,
  Download,
  Eye,
  HardDrive,
  Loader2,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryName, OrientationType, ResolutionOption, Wallpaper } from '../types';
import { CATEGORIES_DATA } from '../data/wallpapers';
import { ADMIN_SUPABASE_UID } from '../lib/supabase';
import { JoinModal } from '../components/JoinModal';

export const AdminDashboard: React.FC = () => {
  const {
    wallpapers,
    addWallpaper,
    uploadWallpaperWithFile,
    deleteWallpaper,
    editWallpaper,
    addToast,
    user
  } = useApp();

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryName>('Cyberpunk');
  const [resolutionTag, setResolutionTag] = useState<ResolutionOption>('4K');
  const [resolution, setResolution] = useState('3840 x 2160');
  const [orientation, setOrientation] = useState<OrientationType>('landscape');
  const [authorName, setAuthorName] = useState('Alex Vance');
  const [tags, setTags] = useState('Cyberpunk, Neon, 4K, Desktop');
  const [colorHexStr, setColorHexStr] = useState('#0B1220, #38BDF8, #818CF8');

  // Direct URL vs Storage File State
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  // Wallpaper edit modal state
  const [editingWallpaper, setEditingWallpaper] = useState<Wallpaper | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editDraft, setEditDraft] = useState<Partial<Wallpaper>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analytics totals
  const totalDownloads = wallpapers.reduce((acc, wp) => acc + (wp.downloads || 0), 0);
  const totalViews = wallpapers.reduce((acc, wp) => acc + (wp.views || 0), 0);

  const handleDeviceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
        return;
      }

      setSelectedFile(file);
      setSelectedFileName(file.name);
      setImageUrl('');

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      addToast(`Selected file "${file.name}" for Supabase Storage`, 'info');
    }
  };

  const openEditWallpaper = (wp: Wallpaper) => {
    setEditingWallpaper(wp);
    setEditDraft({
      title: wp.title,
      description: wp.description,
      category: wp.category,
      resolution: wp.resolution,
      resolutionTag: wp.resolutionTag,
      orientation: wp.orientation,
      aspectRatio: wp.aspectRatio,
      size: wp.size,
      tags: [...wp.tags],
      colorHex: [...wp.colorHex],
      colorName: wp.colorName || '',
      isFeatured: Boolean(wp.isFeatured),
      isWallpaperOfTheDay: Boolean(wp.isWallpaperOfTheDay),
      isAIGenerated: Boolean(wp.isAIGenerated),
      author: { ...wp.author },
    });
  };

  const closeEditWallpaper = () => {
    if (isSavingEdit) return;
    setEditingWallpaper(null);
    setEditDraft({});
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWallpaper) return;

    setIsSavingEdit(true);
    try {
      await editWallpaper(editingWallpaper.id, editDraft);
      setEditingWallpaper(null);
      setEditDraft({});
    } catch (err) {
      // AppContext displays the error toast.
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.isAdmin) {
      addToast('Only the administrator account can upload wallpapers.', 'error');
      return;
    }

    if (!selectedFile && !imageUrl) {
      addToast('Please select an image file to upload OR provide a direct image URL.', 'error');
      return;
    }

    setIsSubmitting(true);

    const parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const parsedColors = colorHexStr.split(',').map((c) => c.trim()).filter(Boolean);

    const metadata: Omit<Wallpaper, 'id' | 'views' | 'downloads' | 'favorites' | 'uploadDate' | 'url' | 'thumbnailUrl'> = {
      title,
      description,
      category,
      resolutionTag,
      resolution,
      orientation,
      tags: parsedTags,
      colorHex: parsedColors,
      size: '5.2 MB',
      aspectRatio: orientation === 'portrait' ? '9:16' : '16:9',
      author: {
        name: authorName || 'Alex Vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
      },
    };

    try {
      if (selectedFile) {
        await uploadWallpaperWithFile(selectedFile, metadata);
      } else {
        await addWallpaper({
          ...metadata,
          url: imageUrl,
          thumbnailUrl: imageUrl,
        });
      }

      // Reset form on success
      setTitle('');
      setDescription('');
      setImageUrl('');
      setSelectedFile(null);
      setSelectedFileName(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      // Error toast is already displayed in AppContext
      console.error('Upload form handler caught error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Access Control: Strict Administrator Check
  if (!user.isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Administrator Access Restricted</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            The Admin Suite and Upload controls are restricted exclusively to the authenticated Supabase administrator account.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 break-all bg-slate-950/60">
          <span className="text-slate-500 block text-[10px] uppercase font-sans font-bold mb-1">
            Required Administrator Supabase UID
          </span>
          {ADMIN_SUPABASE_UID}
        </div>

        <button
          onClick={() => setIsJoinModalOpen(true)}
          className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/20 transition-all inline-flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          <span>Sign In as Administrator</span>
        </button>

        <JoinModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          initialMode="signin"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Admin Suite Banner Header */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>AUTHENTICATED ADMINISTRATOR SUITE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Wallpaper Admin Hub</h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload images directly to Supabase Storage and manage metadata in the PostgreSQL database.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Verified Admin UID</span>
        </div>
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
                  onClick={() => openEditWallpaper(wp)}
                  className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-colors"
                  title="Edit wallpaper"
                >
                  <Pencil className="w-4 h-4" />
                </button>

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

      {/* Edit Wallpaper Modal */}
      {editingWallpaper && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleEditSave}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-slate-700 bg-[#0B1220] shadow-2xl p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Wallpaper Editor</p>
                <h2 className="text-2xl font-extrabold text-white mt-1">Edit Wallpaper</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Changes are saved directly to Supabase. Views, downloads and favorites are preserved.
                </p>
              </div>
              <button type="button" onClick={closeEditWallpaper} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300" title="Close editor">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Title</label>
                <input required value={String(editDraft.title ?? '')} onChange={(e) => setEditDraft((p) => ({ ...p, title: e.target.value }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Author</label>
                <input value={String(editDraft.author?.name ?? '')} onChange={(e) => setEditDraft((p) => ({ ...p, author: { ...(p.author || editingWallpaper.author), name: e.target.value } }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Description</label>
                <textarea rows={3} value={String(editDraft.description ?? '')} onChange={(e) => setEditDraft((p) => ({ ...p, description: e.target.value }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Category</label>
                <select value={editDraft.category} onChange={(e) => setEditDraft((p) => ({ ...p, category: e.target.value as CategoryName }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white">
                  {CATEGORIES_DATA.map((cat) => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Resolution Tag</label>
                <select value={editDraft.resolutionTag} onChange={(e) => setEditDraft((p) => ({ ...p, resolutionTag: e.target.value as ResolutionOption }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white">
                  {(['1080p', '1440p', '4K', '8K', 'Mobile', 'Tablet', 'Desktop'] as ResolutionOption[]).map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Resolution</label>
                <input value={String(editDraft.resolution ?? '')} onChange={(e) => setEditDraft((p) => ({ ...p, resolution: e.target.value }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Orientation</label>
                <select value={editDraft.orientation} onChange={(e) => setEditDraft((p) => ({ ...p, orientation: e.target.value as OrientationType }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white">
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                  <option value="square">Square</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Aspect Ratio</label>
                <input value={String(editDraft.aspectRatio ?? '')} onChange={(e) => setEditDraft((p) => ({ ...p, aspectRatio: e.target.value }))} placeholder="16:9" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">File Size</label>
                <input value={String(editDraft.size ?? '')} onChange={(e) => setEditDraft((p) => ({ ...p, size: e.target.value }))} placeholder="5.2 MB" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Color Name</label>
                <input value={String(editDraft.colorName ?? '')} onChange={(e) => setEditDraft((p) => ({ ...p, colorName: e.target.value }))} placeholder="Blue" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Tags</label>
                <input value={(editDraft.tags || []).join(', ')} onChange={(e) => setEditDraft((p) => ({ ...p, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Color Palette</label>
                <input value={(editDraft.colorHex || []).join(', ')} onChange={(e) => setEditDraft((p) => ({ ...p, colorHex: e.target.value.split(',').map((c) => c.trim()).filter(Boolean) }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono" />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 rounded-xl bg-slate-900 border border-slate-800 p-3 text-sm text-slate-200">
                  <input type="checkbox" checked={Boolean(editDraft.isFeatured)} onChange={(e) => setEditDraft((p) => ({ ...p, isFeatured: e.target.checked }))} /> Featured
                </label>
                <label className="flex items-center gap-3 rounded-xl bg-slate-900 border border-slate-800 p-3 text-sm text-slate-200">
                  <input type="checkbox" checked={Boolean(editDraft.isWallpaperOfTheDay)} onChange={(e) => setEditDraft((p) => ({ ...p, isWallpaperOfTheDay: e.target.checked }))} /> Wallpaper of the Day
                </label>
                <label className="flex items-center gap-3 rounded-xl bg-slate-900 border border-slate-800 p-3 text-sm text-slate-200">
                  <input type="checkbox" checked={Boolean(editDraft.isAIGenerated)} onChange={(e) => setEditDraft((p) => ({ ...p, isAIGenerated: e.target.checked }))} /> AI Generated
                </label>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7 pt-5 border-t border-slate-800">
              <button type="button" onClick={closeEditWallpaper} disabled={isSavingEdit} className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={isSavingEdit} className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                {isSavingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSavingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
