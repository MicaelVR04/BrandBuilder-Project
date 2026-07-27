import React, { useState } from 'react';
import { 
  Grid, 
  Columns, 
  List, 
  Download, 
  Sparkles, 
  Maximize2, 
  Heart, 
  Trash2, 
  RefreshCw, 
  Eye, 
  X, 
  Zap, 
  Check, 
  SlidersHorizontal,
  Info,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { GeneratedAsset, MediumId } from '../types';
import { MEDIUMS } from '../data/mediums';

interface GalleryViewProps {
  assets: GeneratedAsset[];
  productName: string;
  onExportZip: (selectedAssets?: GeneratedAsset[]) => Promise<void>;
  onRegenerateAsset: (mediumId: MediumId) => Promise<void>;
  onDeleteAsset: (assetId: string) => void;
  onToggleFavorite: (assetId: string) => void;
  onAddNewMediums: () => void;
  isExportingZip: boolean;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  assets,
  productName,
  onExportZip,
  onRegenerateAsset,
  onDeleteAsset,
  onToggleFavorite,
  onAddNewMediums,
  isExportingZip,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'split' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeLightbox, setActiveLightbox] = useState<GeneratedAsset | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  // Split View comparison state (compare 2 assets)
  const [splitAsset1, setSplitAsset1] = useState<GeneratedAsset | null>(assets[0] || null);
  const [splitAsset2, setSplitAsset2] = useState<GeneratedAsset | null>(assets[1] || assets[0] || null);

  // Multi-selection for export
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  const filteredAssets = assets.filter((asset) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'favorites') return asset.isFavorite;
    return asset.mediumId === selectedFilter;
  });

  const handleToggleSelectAsset = (id: string) => {
    if (selectedAssetIds.includes(id)) {
      setSelectedAssetIds(selectedAssetIds.filter((a) => a !== id));
    } else {
      setSelectedAssetIds([...selectedAssetIds, id]);
    }
  };

  const handleSelectAllForExport = () => {
    if (selectedAssetIds.length === filteredAssets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(filteredAssets.map((a) => a.id));
    }
  };

  const handleRegenerate = async (asset: GeneratedAsset) => {
    setRegeneratingId(asset.id);
    try {
      await onRegenerateAsset(asset.mediumId);
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleDownloadSingle = (asset: GeneratedAsset) => {
    const link = document.createElement('a');
    link.href = asset.imageUrl;
    link.download = `${productName.toLowerCase().replace(/\s+/g, '_')}_${asset.mediumId}_${asset.aspectRatio.replace(':', 'x')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Gallery Header & Controls */}
      <div className="bg-[#0D0D0F] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#C5A47E] uppercase tracking-widest">
              Campaign Asset Suite
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-white/80 border border-white/10">
              {assets.length} Shot{assets.length !== 1 ? 's' : ''} Rendered
            </span>
          </div>
          <h2 className="text-2xl font-serif text-white tracking-tight mt-0.5">
            {productName} Multi-Medium Gallery
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Compare outputs side-by-side across billboards, newspapers, and social posts. Rendered with Nano-Banana model.
          </p>
        </div>

        {/* View Mode Toggle & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* View mode switcher */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#C5A47E] text-black shadow-md'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => {
                setViewMode('split');
                if (!splitAsset1 && assets[0]) setSplitAsset1(assets[0]);
                if (!splitAsset2 && (assets[1] || assets[0])) setSplitAsset2(assets[1] || assets[0]);
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-[#C5A47E] text-black shadow-md'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#C5A47E] text-black shadow-md'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          </div>

          {/* Add Mediums button */}
          <button
            onClick={onAddNewMediums}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded bg-white/5 hover:bg-white/10 text-white/90 border border-white/20 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A47E]" />
            <span>+ Add Medium</span>
          </button>

          {/* Export ZIP Button */}
          <button
            onClick={() =>
              onExportZip(
                selectedAssetIds.length > 0
                  ? assets.filter((a) => selectedAssetIds.includes(a.id))
                  : undefined
              )
            }
            disabled={isExportingZip || assets.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded bg-[#C5A47E] hover:bg-[#D5B48E] text-black font-semibold text-xs shadow-lg shadow-[#C5A47E]/10 disabled:opacity-50 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>
              {isExportingZip
                ? 'Building High-Res ZIP...'
                : selectedAssetIds.length > 0
                ? `Export ${selectedAssetIds.length} Selected (ZIP)`
                : 'Export Entire Set (High-Res ZIP)'}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`text-xs font-medium px-3.5 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
              selectedFilter === 'all'
                ? 'bg-white/10 text-[#C5A47E] border border-white/20 font-bold'
                : 'bg-[#0D0D0F] hover:bg-white/5 text-white/50 border border-white/10'
            }`}
          >
            All Shots ({assets.length})
          </button>
          <button
            onClick={() => setSelectedFilter('favorites')}
            className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
              selectedFilter === 'favorites'
                ? 'bg-white/10 text-[#C5A47E] border border-white/20 font-bold'
                : 'bg-[#0D0D0F] hover:bg-white/5 text-white/50 border border-white/10'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            Favorites ({assets.filter((a) => a.isFavorite).length})
          </button>

          {MEDIUMS.filter((m) => assets.some((a) => a.mediumId === m.id)).map((medium) => (
            <button
              key={medium.id}
              onClick={() => setSelectedFilter(medium.id)}
              className={`text-xs font-medium px-3.5 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === medium.id
                  ? 'bg-white/10 text-[#C5A47E] border border-white/20 font-bold'
                  : 'bg-[#0D0D0F] hover:bg-white/5 text-white/50 border border-white/10'
              }`}
            >
              {medium.name} ({assets.filter((a) => a.mediumId === medium.id).length})
            </button>
          ))}
        </div>

        {/* Selection toggle for ZIP export */}
        {filteredAssets.length > 0 && (
          <button
            onClick={handleSelectAllForExport}
            className="text-xs text-white/40 hover:text-[#C5A47E] font-medium whitespace-nowrap cursor-pointer transition-colors"
          >
            {selectedAssetIds.length === filteredAssets.length
              ? 'Deselect All'
              : `Select All for ZIP (${filteredAssets.length})`}
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <div className="bg-[#0D0D0F] border border-white/10 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 text-white/40 mx-auto flex items-center justify-center">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Assets Found</h3>
            <p className="text-xs text-white/40 mt-1">
              {selectedFilter !== 'all'
                ? 'No assets match the active filter. Try selecting "All Shots".'
                : 'Generate your first batch of mediums to view campaign outputs here.'}
            </p>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: GRID VIEW */}
      {viewMode === 'grid' && filteredAssets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => {
            const isSelected = selectedAssetIds.includes(asset.id);
            const isRegenerating = regeneratingId === asset.id;

            return (
              <div
                key={asset.id}
                className={`group bg-[#0D0D0F] border rounded-2xl overflow-hidden transition-all shadow-xl flex flex-col justify-between ${
                  isSelected ? 'border-[#C5A47E] ring-1 ring-[#C5A47E]/40' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Image Container with Aspect Ratio */}
                <div className="relative bg-black/60 overflow-hidden aspect-video flex items-center justify-center">
                  <img
                    src={asset.imageUrl}
                    alt={asset.mediumName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Overlays */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[#C5A47E] border border-white/10 font-mono">
                      {asset.aspectRatio}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white/80 border border-white/10">
                      {asset.mediumName}
                    </span>
                  </div>

                  {/* Selection Checkbox */}
                  <button
                    onClick={() => handleToggleSelectAsset(asset.id)}
                    className={`absolute top-3 right-3 w-6 h-6 rounded border flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#C5A47E] border-[#C5A47E] text-black'
                        : 'bg-black/80 border-white/20 text-white/40 opacity-0 group-hover:opacity-100'
                    }`}
                    title="Select for ZIP Export"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                    <button
                      onClick={() => setActiveLightbox(asset)}
                      className="p-2.5 rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg cursor-pointer transition-colors"
                      title="Inspect High-Res Lightbox"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadSingle(asset)}
                      className="p-2.5 rounded bg-[#C5A47E] hover:bg-[#D5B48E] text-black font-bold shadow-lg cursor-pointer transition-colors"
                      title="Download Image File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRegenerate(asset)}
                      disabled={isRegenerating}
                      className="p-2.5 rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg cursor-pointer transition-colors"
                      title="Regenerate Variation"
                    >
                      <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin text-[#C5A47E]' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Card Info & Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{asset.mediumName}</h4>
                      <p className="text-[11px] text-white/40 flex items-center gap-1 mt-0.5">
                        <Zap className="w-3 h-3 text-[#C5A47E]" />
                        <span>Nano-Banana Model</span>
                      </p>
                    </div>

                    <button
                      onClick={() => onToggleFavorite(asset.id)}
                      className="p-1.5 text-white/40 hover:text-rose-400 cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          asset.isFavorite ? 'text-rose-500 fill-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-white/50 line-clamp-2 leading-relaxed bg-black/40 p-2 rounded border border-white/5 font-mono text-[11px]">
                    "{asset.prompt}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-white/30 pt-1">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3" /> Zero-Human Protocol
                    </span>
                    <button
                      onClick={() => onDeleteAsset(asset.id)}
                      className="text-white/40 hover:text-red-400 text-[10px] font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: SIDE-BY-SIDE SPLIT COMPARISON */}
      {viewMode === 'split' && assets.length >= 2 && (
        <div className="bg-[#0D0D0F] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-serif text-white flex items-center gap-2">
                <Columns className="w-5 h-5 text-[#C5A47E]" />
                Side-by-Side Medium Inspector
              </h3>
              <p className="text-xs text-white/50">
                Directly compare visual consistency across any two advertising mediums.
              </p>
            </div>

            {/* Selectors for Asset 1 & Asset 2 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#C5A47E] font-bold">Medium A:</span>
                <select
                  value={splitAsset1?.id || ''}
                  onChange={(e) => setSplitAsset1(assets.find((a) => a.id === e.target.value) || null)}
                  className="bg-black/40 border border-white/10 text-xs text-white/90 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#C5A47E]/50"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id} className="bg-[#0D0D0F]">
                      {a.mediumName} ({a.aspectRatio})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-blue-400 font-bold">Medium B:</span>
                <select
                  value={splitAsset2?.id || ''}
                  onChange={(e) => setSplitAsset2(assets.find((a) => a.id === e.target.value) || null)}
                  className="bg-black/40 border border-white/10 text-xs text-white/90 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#C5A47E]/50"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id} className="bg-[#0D0D0F]">
                      {a.mediumName} ({a.aspectRatio})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dual Split Screen Comparison Layout */}
          {splitAsset1 && splitAsset2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Pane (Medium A) */}
              <div className="bg-black/40 border border-[#C5A47E]/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C5A47E] px-2.5 py-1 rounded bg-[#C5A47E]/10 border border-[#C5A47E]/20">
                    {splitAsset1.mediumName} ({splitAsset1.aspectRatio})
                  </span>
                  <button
                    onClick={() => handleDownloadSingle(splitAsset1)}
                    className="p-1.5 text-xs text-white/80 hover:text-white bg-white/5 rounded border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-[#1A1A1D] border border-white/10 aspect-square flex items-center justify-center">
                  <img
                    src={splitAsset1.imageUrl}
                    alt={splitAsset1.mediumName}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <p className="text-xs text-white/50 font-mono text-[11px] bg-black/40 p-2.5 rounded border border-white/5 leading-relaxed">
                  "{splitAsset1.prompt}"
                </p>
              </div>

              {/* Right Pane (Medium B) */}
              <div className="bg-black/40 border border-blue-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                    {splitAsset2.mediumName} ({splitAsset2.aspectRatio})
                  </span>
                  <button
                    onClick={() => handleDownloadSingle(splitAsset2)}
                    className="p-1.5 text-xs text-white/80 hover:text-white bg-white/5 rounded border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-[#1A1A1D] border border-white/10 aspect-square flex items-center justify-center">
                  <img
                    src={splitAsset2.imageUrl}
                    alt={splitAsset2.mediumName}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <p className="text-xs text-white/50 font-mono text-[11px] bg-black/40 p-2.5 rounded border border-white/5 leading-relaxed">
                  "{splitAsset2.prompt}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 3: DETAILED LIST VIEW */}
      {viewMode === 'list' && filteredAssets.length > 0 && (
        <div className="bg-[#0D0D0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="divide-y divide-white/5">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={asset.imageUrl}
                    alt={asset.mediumName}
                    className="w-20 h-20 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{asset.mediumName}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#C5A47E] border border-white/10 font-bold">
                        {asset.aspectRatio}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 line-clamp-1 mt-1 font-mono">
                      "{asset.prompt}"
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-white/30 mt-2">
                      <span>Model: {asset.model}</span>
                      <span>•</span>
                      <span>Created: {new Date(asset.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => setActiveLightbox(asset)}
                    className="p-2 rounded bg-white/5 text-white/80 hover:text-white border border-white/10"
                    title="View Lightbox"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadSingle(asset)}
                    className="p-2 rounded bg-[#C5A47E] text-black font-bold"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <div className="relative bg-[#0D0D0F] border border-white/10 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold px-3 py-1 rounded bg-white/5 text-[#C5A47E] border border-white/10 uppercase tracking-widest font-mono">
                  {activeLightbox.aspectRatio} Aspect
                </span>
                <h3 className="text-xl font-serif text-white">
                  {activeLightbox.mediumName}
                </h3>
              </div>

              <button
                onClick={() => setActiveLightbox(null)}
                className="p-2 text-white/40 hover:text-white rounded bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Res Image Display */}
            <div className="relative rounded-xl bg-black/60 border border-white/10 overflow-hidden max-h-[55vh] flex items-center justify-center p-2">
              <img
                src={activeLightbox.imageUrl}
                alt={activeLightbox.mediumName}
                className="max-h-[52vh] w-auto object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Prompt & Metadata Details */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-white/40">
                <span className="font-bold text-white/80">Generated Prompt Parameters:</span>
                <span className="flex items-center gap-1 text-[#C5A47E] font-mono text-[11px]">
                  <Zap className="w-3.5 h-3.5" />
                  Engine: {activeLightbox.model}
                </span>
              </div>
              <p className="text-xs text-white/70 font-mono bg-[#0D0D0F] p-3 rounded border border-white/5 leading-relaxed">
                {activeLightbox.prompt}
              </p>
            </div>

            {/* Modal Action Footer */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Zero-human strict protocol verified
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadSingle(activeLightbox)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#C5A47E] hover:bg-[#D5B48E] text-black font-semibold text-xs shadow-lg shadow-[#C5A47E]/10 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download High-Res Asset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
