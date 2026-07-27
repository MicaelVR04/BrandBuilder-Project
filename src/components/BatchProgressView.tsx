import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { GenerationProgress } from '../types';

interface BatchProgressViewProps {
  progressList: GenerationProgress[];
  onCancel: () => void;
  onRetrySingle: (mediumId: string) => void;
  onViewGallery: () => void;
  isComplete: boolean;
  productName: string;
}

export const BatchProgressView: React.FC<BatchProgressViewProps> = ({
  progressList,
  onCancel,
  onRetrySingle,
  onViewGallery,
  isComplete,
  productName,
}) => {
  const completedCount = progressList.filter((p) => p.status === 'completed').length;
  const failedCount = progressList.filter((p) => p.status === 'failed').length;
  const totalCount = progressList.length;
  const percentage = Math.round((completedCount / totalCount) * 100) || 0;

  return (
    <div className="bg-[#0D0D0F] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8">
      {/* Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-[#C5A47E] font-semibold text-[10px] uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Batch Generation Engine • Nano-Banana Model</span>
          </div>
          <h2 className="text-2xl font-serif text-white tracking-tight">
            {isComplete ? 'Batch Complete!' : `Imagining ${productName}`}
          </h2>
          <p className="text-xs text-white/50 mt-1">
            {isComplete
              ? `Generated ${completedCount} medium variations with consistent product styling.`
              : 'Generating medium shots simultaneously with strict zero-human visual protocols.'}
          </p>
        </div>

        {/* Global Action */}
        <div>
          {isComplete ? (
            <button
              onClick={onViewGallery}
              className="flex items-center gap-2 px-6 py-3 rounded bg-[#C5A47E] hover:bg-[#D5B48E] text-black font-semibold text-xs transition-colors shadow-lg shadow-[#C5A47E]/10 cursor-pointer"
            >
              <span>Compare in Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="text-xs px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 font-semibold cursor-pointer"
            >
              Cancel Batch
            </button>
          )}
        </div>
      </div>

      {/* Main Overall Progress Bar */}
      <div className="bg-black/40 border border-white/10 p-5 rounded-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-white/80">
            {completedCount} of {totalCount} Mediums Completed
          </span>
          <span className="text-[#C5A47E] font-mono font-bold text-sm">{percentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-[#1A1A1D] rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-[#C5A47E] transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-white/40">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero-human negative constraints active
          </span>
          <span className="font-mono text-[10px] text-white/40">Nano-Banana 2 Model</span>
        </div>
      </div>

      {/* Grid of Medium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {progressList.map((item) => (
          <div
            key={item.mediumId}
            className={`rounded-xl border p-4 transition-all flex flex-col justify-between h-48 relative overflow-hidden ${
              item.status === 'completed'
                ? 'bg-black/60 border-emerald-500/30'
                : item.status === 'generating'
                ? 'bg-[#1A1A1D] border-[#C5A47E] shadow-xl shadow-[#C5A47E]/5'
                : item.status === 'failed'
                ? 'bg-black/60 border-red-500/40'
                : 'bg-black/30 border-white/5'
            }`}
          >
            {/* Background Thumbnail if completed */}
            {item.status === 'completed' && item.asset?.imageUrl && (
              <img
                src={item.asset.imageUrl}
                alt={item.mediumName}
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity"
                referrerPolicy="no-referrer"
              />
            )}

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold text-white/90">{item.mediumName}</span>
              <div>
                {item.status === 'completed' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
                {item.status === 'generating' && (
                  <Loader2 className="w-5 h-5 text-[#C5A47E] animate-spin" />
                )}
                {item.status === 'pending' && <Clock className="w-4 h-4 text-white/30" />}
                {item.status === 'failed' && <XCircle className="w-5 h-5 text-red-400" />}
              </div>
            </div>

            {/* Middle Status State */}
            <div className="relative z-10 my-2">
              {item.status === 'generating' && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#C5A47E] font-semibold">
                    <Zap className="w-3.5 h-3.5 animate-pulse" />
                    <span>Rendering with Nano-Banana...</span>
                  </div>
                  <p className="text-[11px] text-white/40 line-clamp-1">
                    Applying lighting & medium composition
                  </p>
                </div>
              )}

              {item.status === 'pending' && (
                <p className="text-xs text-white/30">Queued in batch pipeline...</p>
              )}

              {item.status === 'completed' && (
                <p className="text-xs text-emerald-400 font-medium">Ready for comparison</p>
              )}

              {item.status === 'failed' && (
                <div className="space-y-1">
                  <p className="text-xs text-red-400 font-medium line-clamp-2">
                    {item.error || 'Generation error'}
                  </p>
                  <button
                    onClick={() => onRetrySingle(item.mediumId)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#C5A47E] hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry Medium
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Info */}
            <div className="relative z-10 text-[11px] text-white/30 border-t border-white/5 pt-2 flex items-center justify-between">
              <span>{item.mediumId.replace('_', ' ')}</span>
              {item.status === 'completed' && (
                <span className="text-emerald-400 font-mono text-[10px] font-bold">100% Consistent</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
