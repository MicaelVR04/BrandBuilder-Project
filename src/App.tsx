import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  ProductForm 
} from './components/ProductForm';
import { 
  MediumSelector 
} from './components/MediumSelector';
import { 
  BatchProgressView 
} from './components/BatchProgressView';
import { 
  GalleryView 
} from './components/GalleryView';
import { 
  CloudSyncModal 
} from './components/CloudSyncModal';

import { 
  CampaignProject, 
  ProductBrandInfo, 
  MediumId, 
  GeneratedAsset, 
  GenerationProgress 
} from './types';
import { MEDIUMS, PRODUCT_PRESETS } from './data/mediums';
import { exportCampaignAsZip } from './utils/zipExport';

const INITIAL_PRODUCT: ProductBrandInfo = {
  name: PRODUCT_PRESETS[0].name,
  category: PRODUCT_PRESETS[0].category,
  description: PRODUCT_PRESETS[0].description,
  tagline: PRODUCT_PRESETS[0].tagline,
  materials: PRODUCT_PRESETS[0].materials,
  colors: PRODUCT_PRESETS[0].colors,
  logoDescription: PRODUCT_PRESETS[0].logoDescription,
};

export default function App() {
  const [step, setStep] = useState<'product' | 'select_mediums' | 'generating' | 'gallery'>('product');

  // Active Campaign Project State
  const [currentProject, setCurrentProject] = useState<CampaignProject>({
    id: `proj_${Date.now()}`,
    name: INITIAL_PRODUCT.name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    product: INITIAL_PRODUCT,
    assets: [],
    selectedMediums: ['billboard', 'newspaper', 'social_post', 'storefront'],
    nanoModel: 'gemini-3.1-flash-lite-image',
    isCloudSynced: false,
  });

  // Batch Generation State
  const [variationsPerMedium, setVariationsPerMedium] = useState<number>(1);
  const [progressList, setProgressList] = useState<GenerationProgress[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGeneratingAnchor, setIsGeneratingAnchor] = useState<boolean>(false);

  // Cloud Sync & Projects List
  const [projectsList, setProjectsList] = useState<CampaignProject[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);

  // Load Cloud Projects on Mount
  useEffect(() => {
    fetchCloudProjects();
  }, []);

  // Check URL query parameters for shared project ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    if (projectId) {
      loadProjectById(projectId);
    }
  }, []);

  const fetchCloudProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjectsList(data);
      }
    } catch (err) {
      console.error('Failed to fetch cloud projects:', err);
    }
  };

  const loadProjectById = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const proj = await res.json();
        setCurrentProject(proj);
        if (proj.assets && proj.assets.length > 0) {
          setStep('gallery');
        } else {
          setStep('select_mediums');
        }
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    }
  };

  const syncActiveProjectToCloud = async (updatedProject?: CampaignProject) => {
    const projToSync = updatedProject || currentProject;
    setIsSyncing(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projToSync),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentProject((prev) => ({ ...prev, isCloudSynced: true }));
        fetchCloudProjects();
      }
    } catch (err) {
      console.error('Failed to sync project:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Helper to handle product form update
  const handleUpdateProduct = (updated: Partial<ProductBrandInfo>) => {
    setCurrentProject((prev) => {
      const updatedProd = { ...prev.product, ...updated };
      return {
        ...prev,
        name: updatedProd.name || prev.name,
        product: updatedProd,
        updatedAt: Date.now(),
      };
    });
  };

  // Generate Hero Anchor Image for product consistency
  const handleGenerateAnchorImage = async () => {
    setIsGeneratingAnchor(true);
    try {
      const prompt = `A pristine 3D studio hero product shot of ${currentProject.product.name}. ${currentProject.product.description}. Materials: ${currentProject.product.materials}. Brand colors: ${currentProject.product.colors.join(', ')}. Set against a clean neutral architectural pedestal. STRICT REQUIREMENT: NO PEOPLE, NO HUMANS, NO HANDS, NO FACES in the image. Pure product presentation.`;

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio: '1:1',
          nanoModel: currentProject.nanoModel,
          productName: currentProject.product.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to render hero anchor image');
      }

      handleUpdateProduct({ baseImageUrl: data.imageUrl });
    } catch (err: any) {
      alert(err.message || 'Error rendering hero anchor image.');
    } finally {
      setIsGeneratingAnchor(false);
    }
  };

  // Toggle Medium selection
  const handleToggleMedium = (id: MediumId) => {
    setCurrentProject((prev) => {
      const selected = prev.selectedMediums.includes(id)
        ? prev.selectedMediums.filter((m) => m !== id)
        : [...prev.selectedMediums, id];
      return { ...prev, selectedMediums: selected };
    });
  };

  const handleSelectAllMediums = () => {
    setCurrentProject((prev) => ({
      ...prev,
      selectedMediums: MEDIUMS.map((m) => m.id),
    }));
  };

  const handleDeselectAllMediums = () => {
    setCurrentProject((prev) => ({
      ...prev,
      selectedMediums: [],
    }));
  };

  // Start Batch Generation
  const handleStartBatchGeneration = async () => {
    if (currentProject.selectedMediums.length === 0) return;

    setIsGenerating(true);
    setStep('generating');

    // Build initial progress list
    const initialProgress: GenerationProgress[] = [];
    currentProject.selectedMediums.forEach((mediumId) => {
      const mediumConfig = MEDIUMS.find((m) => m.id === mediumId);
      if (mediumConfig) {
        for (let i = 0; i < variationsPerMedium; i++) {
          initialProgress.push({
            mediumId,
            mediumName: `${mediumConfig.name}${variationsPerMedium > 1 ? ` (Var ${i + 1})` : ''}`,
            status: 'pending',
          });
        }
      }
    });

    setProgressList(initialProgress);

    const generatedAssets: GeneratedAsset[] = [];

    // Process mediums sequentially/batch with state updates
    for (let index = 0; index < initialProgress.length; index++) {
      const item = initialProgress[index];
      const mediumConfig = MEDIUMS.find((m) => m.id === item.mediumId);
      if (!mediumConfig) continue;

      // Update status to generating
      setProgressList((prev) =>
        prev.map((p, idx) => (idx === index ? { ...p, status: 'generating' } : p))
      );

      try {
        // Construct detailed prompt from template
        const formattedPrompt = mediumConfig.promptTemplate
          .replace(/{product_name}/g, currentProject.product.name)
          .replace(/{tagline}/g, currentProject.product.tagline)
          .replace(/{colors}/g, currentProject.product.colors.join(', '))
          .concat(` Materials: ${currentProject.product.materials}.`);

        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: formattedPrompt,
            aspectRatio: mediumConfig.aspectRatio,
            nanoModel: currentProject.nanoModel,
            baseImageUrl: currentProject.product.baseImageUrl, // Reference anchor for product consistency!
            productName: currentProject.product.name,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to generate medium image');
        }

        const newAsset: GeneratedAsset = {
          id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          mediumId: item.mediumId,
          mediumName: mediumConfig.name,
          imageUrl: data.imageUrl,
          prompt: formattedPrompt,
          model: data.model || currentProject.nanoModel,
          aspectRatio: mediumConfig.aspectRatio,
          createdAt: Date.now(),
          isFavorite: false,
        };

        generatedAssets.push(newAsset);

        setProgressList((prev) =>
          prev.map((p, idx) =>
            idx === index ? { ...p, status: 'completed', asset: newAsset } : p
          )
        );
      } catch (err: any) {
        console.error(`Batch error for ${item.mediumName}:`, err);
        setProgressList((prev) =>
          prev.map((p, idx) =>
            idx === index
              ? { ...p, status: 'failed', error: err.message || 'Generation error' }
              : p
          )
        );
      }
    }

    setIsGenerating(false);

    // Update project state with new assets and sync to cloud
    const updatedProject = {
      ...currentProject,
      assets: [...currentProject.assets, ...generatedAssets],
      updatedAt: Date.now(),
    };

    setCurrentProject(updatedProject);
    syncActiveProjectToCloud(updatedProject);
  };

  // Regenerate a single medium asset
  const handleRegenerateAsset = async (mediumId: MediumId) => {
    const mediumConfig = MEDIUMS.find((m) => m.id === mediumId);
    if (!mediumConfig) return;

    const formattedPrompt = mediumConfig.promptTemplate
      .replace(/{product_name}/g, currentProject.product.name)
      .replace(/{tagline}/g, currentProject.product.tagline)
      .replace(/{colors}/g, currentProject.product.colors.join(', '))
      .concat(` Materials: ${currentProject.product.materials}.`);

    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: formattedPrompt,
        aspectRatio: mediumConfig.aspectRatio,
        nanoModel: currentProject.nanoModel,
        baseImageUrl: currentProject.product.baseImageUrl,
        productName: currentProject.product.name,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to regenerate medium');
    }

    const newAsset: GeneratedAsset = {
      id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      mediumId,
      mediumName: mediumConfig.name,
      imageUrl: data.imageUrl,
      prompt: formattedPrompt,
      model: data.model || currentProject.nanoModel,
      aspectRatio: mediumConfig.aspectRatio,
      createdAt: Date.now(),
      isFavorite: false,
    };

    const updatedProject = {
      ...currentProject,
      assets: [newAsset, ...currentProject.assets],
      updatedAt: Date.now(),
    };

    setCurrentProject(updatedProject);
    syncActiveProjectToCloud(updatedProject);
  };

  const handleDeleteAsset = (assetId: string) => {
    const updatedAssets = currentProject.assets.filter((a) => a.id !== assetId);
    const updatedProject = {
      ...currentProject,
      assets: updatedAssets,
      updatedAt: Date.now(),
    };
    setCurrentProject(updatedProject);
    syncActiveProjectToCloud(updatedProject);
  };

  const handleToggleFavoriteAsset = (assetId: string) => {
    const updatedAssets = currentProject.assets.map((a) =>
      a.id === assetId ? { ...a, isFavorite: !a.isFavorite } : a
    );
    const updatedProject = {
      ...currentProject,
      assets: updatedAssets,
      updatedAt: Date.now(),
    };
    setCurrentProject(updatedProject);
    syncActiveProjectToCloud(updatedProject);
  };

  // ZIP Export Trigger
  const handleExportZip = async (selectedAssets?: GeneratedAsset[]) => {
    setIsExportingZip(true);
    try {
      await exportCampaignAsZip(currentProject, selectedAssets);
    } catch (err: any) {
      alert(err.message || 'Failed to generate ZIP archive.');
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleCreateNewProject = () => {
    const newProj: CampaignProject = {
      id: `proj_${Date.now()}`,
      name: 'New Product Concept',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      product: {
        name: '',
        category: 'Electronics',
        description: '',
        tagline: '',
        materials: '',
        colors: ['#000000', '#FFFFFF'],
      },
      assets: [],
      selectedMediums: ['billboard', 'newspaper', 'social_post', 'storefront'],
      nanoModel: 'gemini-3.1-flash-lite-image',
      isCloudSynced: false,
    };
    setCurrentProject(newProj);
    setStep('product');
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      fetchCloudProjects();
      if (currentProject.id === id) {
        handleCreateNewProject();
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white/90 flex flex-col font-sans selection:bg-[#C5A47E] selection:text-black">
      {/* App Navigation Bar */}
      <Navbar
        currentProject={currentProject}
        projectsList={projectsList}
        isSyncing={isSyncing}
        onNewProject={handleCreateNewProject}
        onSelectProject={loadProjectById}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onExportZip={() => handleExportZip()}
        hasAssets={currentProject.assets.length > 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Step Indicator Tabs */}
        <div className="flex items-center justify-center sm:justify-start gap-2 bg-[#0D0D0F] border border-white/10 p-1.5 rounded-xl max-w-fit mx-auto sm:mx-0 shadow-xl overflow-x-auto">
          <button
            onClick={() => setStep('product')}
            className={`px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer ${
              step === 'product'
                ? 'bg-[#C5A47E] text-black shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            1. Product Concept
          </button>
          <button
            onClick={() => setStep('select_mediums')}
            className={`px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer ${
              step === 'select_mediums'
                ? 'bg-[#C5A47E] text-black shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            2. Choose Mediums
          </button>
          {currentProject.assets.length > 0 && (
            <button
              onClick={() => setStep('gallery')}
              className={`px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer ${
                step === 'gallery'
                  ? 'bg-[#C5A47E] text-black shadow-md'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              3. Campaign Gallery ({currentProject.assets.length})
            </button>
          )}
        </div>

        {/* STEP 1: Product Definition */}
        {step === 'product' && (
          <ProductForm
            product={currentProject.product}
            onChange={handleUpdateProduct}
            onGenerateAnchorImage={handleGenerateAnchorImage}
            isGeneratingAnchor={isGeneratingAnchor}
            onNextStep={() => setStep('select_mediums')}
          />
        )}

        {/* STEP 2: Select Advertising Mediums */}
        {step === 'select_mediums' && (
          <MediumSelector
            product={currentProject.product}
            selectedMediums={currentProject.selectedMediums}
            onToggleMedium={handleToggleMedium}
            onSelectAll={handleSelectAllMediums}
            onDeselectAll={handleDeselectAllMediums}
            nanoModel={currentProject.nanoModel}
            onChangeNanoModel={(model) =>
              setCurrentProject((prev) => ({ ...prev, nanoModel: model }))
            }
            variationsPerMedium={variationsPerMedium}
            onChangeVariations={setVariationsPerMedium}
            onStartBatchGeneration={handleStartBatchGeneration}
            onBackStep={() => setStep('product')}
            isGenerating={isGenerating}
          />
        )}

        {/* STEP 3: Active Batch Progress */}
        {step === 'generating' && (
          <BatchProgressView
            progressList={progressList}
            onCancel={() => setIsGenerating(false)}
            onRetrySingle={(mediumId) => handleRegenerateAsset(mediumId as MediumId)}
            onViewGallery={() => setStep('gallery')}
            isComplete={!isGenerating}
            productName={currentProject.product.name}
          />
        )}

        {/* STEP 4: Campaign Gallery & Output Comparison */}
        {step === 'gallery' && (
          <GalleryView
            assets={currentProject.assets}
            productName={currentProject.product.name}
            onExportZip={handleExportZip}
            onRegenerateAsset={handleRegenerateAsset}
            onDeleteAsset={handleDeleteAsset}
            onToggleFavorite={handleToggleFavoriteAsset}
            onAddNewMediums={() => setStep('select_mediums')}
            isExportingZip={isExportingZip}
          />
        )}
      </main>

      {/* Cloud Sync Modal */}
      {isSyncModalOpen && (
        <CloudSyncModal
          currentProject={currentProject}
          projectsList={projectsList}
          isSyncing={isSyncing}
          onSyncCurrentProject={() => syncActiveProjectToCloud()}
          onLoadProject={loadProjectById}
          onDeleteProject={handleDeleteProject}
          onClose={() => setIsSyncModalOpen(false)}
        />
      )}
    </div>
  );
}
