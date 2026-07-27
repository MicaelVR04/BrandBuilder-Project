import React, { useState } from 'react';
import { 
  Cloud, 
  CloudCheck, 
  Check, 
  Copy, 
  Trash2, 
  X, 
  RefreshCw, 
  Share2, 
  FolderKanban, 
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { CampaignProject } from '../types';

interface CloudSyncModalProps {
  currentProject: CampaignProject;
  projectsList: CampaignProject[];
  isSyncing: boolean;
  onSyncCurrentProject: () => Promise<void>;
  onLoadProject: (id: string) => void;
  onDeleteProject: (id: string) => Promise<void>;
  onClose: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  currentProject,
  projectsList,
  isSyncing,
  onSyncCurrentProject,
  onLoadProject,
  onDeleteProject,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const shareUrl = `${window.location.origin}?project=${currentProject.id}`;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteProject(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D0D0F] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-white/5 border border-white/10 text-[#C5A47E] flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-white">
                Cloud Synchronization
              </h3>
              <p className="text-xs text-white/50">
                Seamlessly access your brand assets and campaigns across any device.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Project Status Card */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A47E]">
                Active Campaign
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">{currentProject.name}</h4>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CloudCheck className="w-3.5 h-3.5" />
                {currentProject.isCloudSynced ? 'Synced' : 'Local Only'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-white/50 pt-2 border-t border-white/5">
            <div>
              <span className="block text-[11px] text-white/40">Rendered Assets:</span>
              <span className="font-bold text-white/90">{currentProject.assets.length} Shots</span>
            </div>
            <div>
              <span className="block text-[11px] text-white/40">Last Synced:</span>
              <span className="font-bold text-white/90">
                {new Date(currentProject.updatedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Sync Now Button */}
          <button
            onClick={onSyncCurrentProject}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded font-semibold text-xs bg-[#C5A47E] hover:bg-[#D5B48E] text-black shadow-lg shadow-[#C5A47E]/10 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing to Cloud...' : 'Sync Active Campaign Now'}</span>
          </button>
        </div>

        {/* Shareable Link Generator */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-white/60 uppercase tracking-widest">
            Shareable Campaign Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-black/40 border border-white/10 rounded px-3.5 py-2 text-xs font-mono text-white/70 focus:outline-none"
            />
            <button
              onClick={handleCopyShareLink}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white/90 font-medium text-xs border border-white/10 cursor-pointer shrink-0 transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#C5A47E]" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Synced Projects History List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-1.5">
              <FolderKanban className="w-4 h-4 text-[#C5A47E]" />
              Cloud Storage Projects ({projectsList.length})
            </span>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-xl divide-y divide-white/5 max-h-48 overflow-y-auto">
            {projectsList.length === 0 ? (
              <div className="p-4 text-center text-xs text-white/40">
                No cloud synced projects found yet.
              </div>
            ) : (
              projectsList.map((project) => (
                <div
                  key={project.id}
                  className="p-3.5 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div>
                    <h5 className="text-xs font-bold text-white">{project.name}</h5>
                    <p className="text-[11px] text-white/40">
                      {project.assets.length} assets • Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.id !== currentProject.id && (
                      <button
                        onClick={() => {
                          onLoadProject(project.id);
                          onClose();
                        }}
                        className="text-xs px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 font-medium cursor-pointer transition-colors"
                      >
                        Load
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                      className="p-1.5 text-white/40 hover:text-red-400 cursor-pointer transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5 text-xs text-white/70">
          <Info className="w-4 h-4 text-[#C5A47E] shrink-0" />
          <span>
            All campaign assets and prompts are stored securely in full-stack cloud memory and persistent storage for multi-device access.
          </span>
        </div>
      </div>
    </div>
  );
};
