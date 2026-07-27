import React, { useState } from 'react';
import { 
  Check, 
  Layers, 
  Zap, 
  Sparkles, 
  ArrowLeft, 
  Maximize2, 
  Newspaper, 
  Share2, 
  Store, 
  BookOpen, 
  Bus, 
  Monitor, 
  TrainTrack, 
  Package,
  Sliders,
  Settings2
} from 'lucide-react';
import { MediumId, MediumConfig, ProductBrandInfo } from '../types';
import { MEDIUMS } from '../data/mediums';

interface MediumSelectorProps {
  product: ProductBrandInfo;
  selectedMediums: MediumId[];
  onToggleMedium: (id: MediumId) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  nanoModel: 'gemini-3.1-flash-image' | 'gemini-3.1-flash-lite-image';
  onChangeNanoModel: (model: 'gemini-3.1-flash-image' | 'gemini-3.1-flash-lite-image') => void;
  variationsPerMedium: number;
  onChangeVariations: (count: number) => void;
  onStartBatchGeneration: () => void;
  onBackStep: () => void;
  isGenerating: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Maximize2,
  Newspaper,
  Share2,
  Store,
  BookOpen,
  Bus,
  Monitor,
  TrainTrack,
  Package,
};

export const MediumSelector: React.FC<MediumSelectorProps> = ({
  product,
  selectedMediums,
  onToggleMedium,
  onSelectAll,
  onDeselectAll,
  nanoModel,
  onChangeNanoModel,
  variationsPerMedium,
  onChangeVariations,
  onStartBatchGeneration,
  onBackStep,
  isGenerating,
}) => {
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});

  const totalShotsToGenerate = selectedMediums.length * variationsPerMedium;

  return (
    <div className="bg-[#0D0D0F] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-[#C5A47E] font-semibold text-[10px] uppercase tracking-widest mb-1">
            <Layers className="w-4 h-4" />
            <span>Step 2: Select Mediums & Batch Settings</span>
          </div>
          <h2 className="text-2xl font-serif text-white tracking-tight">
            Choose Advertising Mediums
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Select where you want to imagine <strong className="text-white/80 font-semibold">{product.name}</strong>. Each medium uses tailored prompt geometry and aspect ratios.
          </p>
        </div>

        {/* Medium Selection Helper Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSelectAll}
            className="text-xs px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 font-medium transition-colors cursor-pointer"
          >
            Select All ({MEDIUMS.length})
          </button>
          <button
            onClick={onDeselectAll}
            className="text-xs px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/40 font-medium transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Model & Batch Settings Bar */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Nano-Banana Model Selection */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-white/5 border border-white/10 text-[#C5A47E] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Image Generation Engine
            </label>
            <select
              value={nanoModel}
              onChange={(e) =>
                onChangeNanoModel(e.target.value as 'gemini-3.1-flash-image' | 'gemini-3.1-flash-lite-image')
              }
              className="mt-1 bg-[#0D0D0F] border border-white/10 text-white/90 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-[#C5A47E]/50 cursor-pointer"
            >
              <option value="gemini-3.1-flash-image">Nano-Banana 2 (gemini-3.1-flash-image) [High Res 1K/2K]</option>
              <option value="gemini-3.1-flash-lite-image">Nano-Banana Lite (gemini-3.1-flash-lite-image)</option>
            </select>
          </div>
        </div>

        {/* Batch Variations Count */}
        <div className="flex items-center justify-start md:justify-end gap-3">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-white/40" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Variations Per Medium:
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#0D0D0F] border border-white/10 p-1 rounded">
            {[1, 2, 3].map((count) => (
              <button
                key={count}
                onClick={() => onChangeVariations(count)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  variationsPerMedium === count
                    ? 'bg-[#C5A47E] text-black shadow-sm'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {count}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mediums Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MEDIUMS.map((medium) => {
          const isSelected = selectedMediums.includes(medium.id);
          const IconComponent = ICON_MAP[medium.icon] || Maximize2;

          return (
            <div
              key={medium.id}
              onClick={() => onToggleMedium(medium.id)}
              className={`relative rounded-xl p-5 border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#1A1A1D] border-[#C5A47E] shadow-xl shadow-[#C5A47E]/5'
                  : 'bg-black/40 border-white/10 hover:border-white/20 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#C5A47E] text-black font-bold'
                          : 'bg-white/5 text-white/40'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#C5A47E] transition-colors">
                        {medium.name}
                      </h3>
                      <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
                        {medium.category}
                      </span>
                    </div>
                  </div>

                  {/* Selection Checkbox */}
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#C5A47E] border-[#C5A47E] text-black'
                        : 'border-white/20 bg-black/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs text-white/50 leading-relaxed mb-4">
                  {medium.description}
                </p>
              </div>

              {/* Aspect Ratio Badge & Details */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px]">
                <span className="font-mono font-semibold px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[#C5A47E]">
                  {medium.aspectRatio} Aspect
                </span>
                <span className="text-white/30 font-medium">
                  {medium.defaultDimensions.width}x{medium.defaultDimensions.height}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
        <button
          onClick={onBackStep}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-white/5 hover:bg-white/10 text-white/80 font-semibold text-xs border border-white/20 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Product Details</span>
        </button>

        <button
          onClick={onStartBatchGeneration}
          disabled={selectedMediums.length === 0 || isGenerating}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded bg-[#C5A47E] hover:bg-[#D5B48E] text-black font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#C5A47E]/10 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Generating Batch...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>
                Batch Generate {totalShotsToGenerate} Shot{totalShotsToGenerate > 1 ? 's' : ''} (Nano-Banana)
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
