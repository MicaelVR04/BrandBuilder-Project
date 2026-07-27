import React from 'react';
import { 
  Sparkles, 
  Cloud, 
  CloudCheck, 
  Download, 
  PlusCircle, 
  Layers, 
  Zap,
  FolderKanban
} from 'lucide-react';
import { CampaignProject } from '../types';

interface NavbarProps {
  currentProject: CampaignProject;
  projectsList: CampaignProject[];
  isSyncing: boolean;
  onNewProject: () => void;
  onSelectProject: (id: string) => void;
  onOpenSyncModal: () => void;
  onExportZip: () => void;
  hasAssets: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  projectsList,
  isSyncing,
  onNewProject,
  onSelectProject,
  onOpenSyncModal,
  onExportZip,
  hasAssets,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0F]/95 backdrop-blur-md border-b border-white/5 text-[#E0E0E0] px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-[#C5A47E] via-[#D5B48E] to-amber-200 p-0.5 shadow-md shadow-[#C5A47E]/20">
              <div className="h-full w-full bg-[#0A0A0B] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#C5A47E]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-serif italic tracking-tight text-[#C5A47E]">
                  BrandBuilder
                </h1>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  Nano-Banana
                </div>
              </div>
              <p className="text-[11px] text-white/40 hidden sm:block tracking-wide">
                Multi-Medium Generative Consistency Suite
              </p>
            </div>
          </div>

          {/* New project mobile button */}
          <button
            onClick={onNewProject}
            className="sm:hidden p-2 text-white/60 hover:text-white rounded-lg bg-white/5 border border-white/10"
            title="New Campaign"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Project Selector & Global Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
          {/* Saved Projects Dropdown */}
          {projectsList.length > 0 && (
            <div className="relative">
              <select
                value={currentProject.id}
                onChange={(e) => onSelectProject(e.target.value)}
                className="bg-black/40 border border-white/10 text-white/80 text-xs font-medium rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#C5A47E]/50 cursor-pointer appearance-none max-w-[160px] sm:max-w-[200px] truncate"
              >
                {projectsList.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#0D0D0F]">
                    {p.name || 'Untitled Campaign'} ({p.assets.length} assets)
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/40">
                <FolderKanban className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* Cloud Synchronization Status Indicator */}
          <button
            onClick={onOpenSyncModal}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-all cursor-pointer ${
              currentProject.isCloudSynced
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
            }`}
            title="Cloud Synchronization Settings"
          >
            {isSyncing ? (
              <>
                <Cloud className="w-3.5 h-3.5 animate-bounce text-[#C5A47E]" />
                <span className="hidden md:inline uppercase text-[10px] tracking-widest">Syncing...</span>
              </>
            ) : currentProject.isCloudSynced ? (
              <>
                <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline uppercase text-[10px] tracking-widest">Cloud Synced</span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-white/40" />
                <span className="hidden md:inline uppercase text-[10px] tracking-widest">Cloud Sync</span>
              </>
            )}
          </button>

          {/* High-Res ZIP Export Button */}
          {hasAssets && (
            <button
              onClick={onExportZip}
              className="flex items-center gap-2 px-4 py-2 bg-[#C5A47E] text-black font-semibold rounded text-xs hover:bg-[#D5B48E] transition-colors shadow-lg shadow-[#C5A47E]/10 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export High-Res .ZIP</span>
            </button>
          )}

          {/* New Campaign Button */}
          <button
            onClick={onNewProject}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/20 text-white/90 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#C5A47E]" />
            <span>New Brand</span>
          </button>
        </div>
      </div>
    </header>
  );
};
