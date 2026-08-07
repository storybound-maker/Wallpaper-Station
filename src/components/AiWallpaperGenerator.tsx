import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Sparkles, Download, PlusCircle, RefreshCw, Layers, Wand2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryName } from '../types';

export const AiWallpaperGenerator: React.FC = () => {
  const { addWallpaper, addToast, setActiveWallpaper } = useApp();

  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<CategoryName>('Cyberpunk');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    title: string;
    description: string;
    url: string;
    category: CategoryName;
    resolutionTag: '4K';
  } | null>(null);

  const samplePrompts = [
    'Cyberpunk samurai standing under neon pink rain in 8K ultra detail',
    'Minimalist emerald glass waves with subtle glowing silver particles',
    'Cosmic black hole surrounded by swirling violet nebulae and distant stars',
    'Retrowave synthwave sunset over a glossy dark grid horizon',
    'Futuristic hypercar parked in a sleek dark brutalist hangar'
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedResult(null);

    // Simulate AI image generation synthesis
    setTimeout(() => {
      // High resolution AI artistic stock representations
      const sampleAiImages = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2560&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2560&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2560&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2560&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2560&auto=format&fit=crop',
      ];
      const randomImage = sampleAiImages[Math.floor(Math.random() * sampleAiImages.length)];

      const title = prompt.slice(0, 32).replace(/\b\w/g, (l) => l.toUpperCase()) + ' (AI Edition)';
      const description = `AI Generated Wallpaper based on prompt: "${prompt}". Synthesized with high definition lighting and neural detail.`;

      setGeneratedResult({
        title,
        description,
        url: randomImage,
        category,
        resolutionTag: '4K',
      });

      setIsGenerating(false);
      addToast('AI Wallpaper generated successfully!', 'success');
    }, 2500);
  };

  const handlePublishToGallery = () => {
    if (!generatedResult) return;

    addWallpaper({
      title: generatedResult.title,
      description: generatedResult.description,
      url: generatedResult.url,
      thumbnailUrl: generatedResult.url,
      category: generatedResult.category,
      resolution: aspectRatio === '9:16' ? '1290 x 2796' : '3840 x 2160',
      resolutionTag: '4K',
      size: '5.2 MB',
      orientation: aspectRatio === '9:16' ? 'portrait' : 'landscape',
      colorHex: ['#0B1220', '#38BDF8', '#818CF8'],
      colorName: 'Blue',
      tags: ['AI Generated', 'Gemini AI', category, '4K'],
      author: {
        name: 'Wallpaper AI Engine',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      },
      isAIGenerated: true,
      aspectRatio,
    });

    setGeneratedResult(null);
    setPrompt('');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-sky-500/30 text-sky-400 text-xs font-bold">
          <Bot className="w-4 h-4" />
          <span>AI STUDIO WALLPAPER GENERATOR</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Create Custom <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">AI Wallpapers</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Describe any dream wallpaper prompt and our neural model will synthesize a high resolution 4K asset instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form controls */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Wallpaper Prompt Description
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g., A rainy cyberpunk alley at night with magenta neon billboards and wet street reflections..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/80 transition-all"
              />
            </div>

            {/* Quick Prompt Ideas */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">Try a sample prompt:</span>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sp)}
                    className="text-xs text-slate-400 bg-slate-900 hover:text-sky-300 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors text-left"
                  >
                    {sp.slice(0, 36)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryName)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="Cyberpunk">Cyberpunk</option>
                  <option value="Space">Space</option>
                  <option value="Abstract">Abstract</option>
                  <option value="AMOLED">AMOLED</option>
                  <option value="Nature">Nature</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Minimal">Minimal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="16:9">Desktop (16:9)</option>
                  <option value="9:16">Mobile (9:16)</option>
                  <option value="1:1">Square (1:1)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-xl shadow-sky-500/20 disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Neural 4K Wallpaper...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 text-sky-200" />
                  <span>Generate AI Wallpaper</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Stage Preview */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-700/80 flex flex-col items-center justify-center min-h-[380px] text-center relative overflow-hidden">
          {isGenerating ? (
            <div className="space-y-4 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-sky-400 animate-spin" />
              </div>
              <p className="text-sm font-semibold text-sky-300">Rendering 4K Neural Canvas...</p>
              <p className="text-xs text-slate-500">Applying raytracing and color contrast enhancements</p>
            </div>
          ) : generatedResult ? (
            <div className="w-full space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
                <img
                  src={generatedResult.url}
                  alt={generatedResult.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  AI 4K Result
                </div>
              </div>

              <div className="text-left space-y-1">
                <h3 className="font-bold text-white text-base">{generatedResult.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{generatedResult.description}</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handlePublishToGallery}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish to Station Gallery</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-6 text-slate-500">
              <Layers className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">Your AI wallpaper preview will appear here</p>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Select your preferred prompt and aspect ratio to begin generating custom artwork.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
