import React, { useState } from 'react';
import { 
  Package, 
  Sparkles, 
  Palette, 
  Tag, 
  Wand2, 
  Upload, 
  CheckCircle2, 
  Layers, 
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';
import { ProductBrandInfo } from '../types';
import { PRODUCT_PRESETS } from '../data/mediums';

interface ProductFormProps {
  product: ProductBrandInfo;
  onChange: (updated: Partial<ProductBrandInfo>) => void;
  onGenerateAnchorImage: () => Promise<void>;
  isGeneratingAnchor: boolean;
  onNextStep: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onChange,
  onGenerateAnchorImage,
  isGeneratingAnchor,
  onNextStep,
}) => {
  const [activeColorInput, setActiveColorInput] = useState('#1A1A1A');

  const handleApplyPreset = (preset: typeof PRODUCT_PRESETS[0]) => {
    onChange({
      name: preset.name,
      category: preset.category,
      description: preset.description,
      tagline: preset.tagline,
      materials: preset.materials,
      colors: preset.colors,
      logoDescription: preset.logoDescription,
      baseImageUrl: undefined, // reset anchor to generate fresh
    });
  };

  const handleAddColor = () => {
    if (product.colors.length < 5 && !product.colors.includes(activeColorInput)) {
      onChange({ colors: [...product.colors, activeColorInput] });
    }
  };

  const handleRemoveColor = (hex: string) => {
    onChange({ colors: product.colors.filter((c) => c !== hex) });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ baseImageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#0D0D0F] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8">
      {/* Header section with Presets */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-[#C5A47E] font-semibold text-[10px] uppercase tracking-widest mb-1">
              <Package className="w-4 h-4" />
              <span>Step 1: Define Product & Brand Concept</span>
            </div>
            <h2 className="text-2xl font-serif text-white tracking-tight">
              Describe Your Product
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Specify visual attributes, materials, and brand aesthetics to maintain high consistency across all mediums.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Presets:</span>
            {PRODUCT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset)}
                className="text-xs px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors font-medium cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 columns: Text Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="e.g. AuraSound Horizon"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-[#E0E0E0] text-sm focus:outline-none focus:border-[#C5A47E]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={product.category}
                onChange={(e) => onChange({ category: e.target.value })}
                placeholder="e.g. Premium Audio Technology"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-[#E0E0E0] text-sm focus:outline-none focus:border-[#C5A47E]/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
              Tagline / Campaign Slogan
            </label>
            <input
              type="text"
              value={product.tagline}
              onChange={(e) => onChange({ tagline: e.target.value })}
              placeholder="e.g. Pure Sound. Infinite Horizon."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-[#E0E0E0] text-sm focus:outline-none focus:border-[#C5A47E]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
              Detailed Product Visual Description *
            </label>
            <textarea
              rows={3}
              value={product.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Describe shape, geometry, buttons, unique design features..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-[#E0E0E0] text-sm focus:outline-none focus:border-[#C5A47E]/50 transition-colors resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
                Materials & Surface Finish
              </label>
              <input
                type="text"
                value={product.materials}
                onChange={(e) => onChange({ materials: e.target.value })}
                placeholder="e.g. Anodized aluminum, matte ceramic, dark leather"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-[#E0E0E0] text-sm focus:outline-none focus:border-[#C5A47E]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
                Logo / Brand Mark Details
              </label>
              <input
                type="text"
                value={product.logoDescription || ''}
                onChange={(e) => onChange({ logoDescription: e.target.value })}
                placeholder="e.g. Minimalist geometric wave icon inside a circle"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-[#E0E0E0] text-sm focus:outline-none focus:border-[#C5A47E]/50 transition-colors"
              />
            </div>
          </div>

          {/* Color Palette Manager */}
          <div>
            <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2">
              Brand Color Palette
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {product.colors.map((hex) => (
                <div
                  key={hex}
                  className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-white/80"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
                    style={{ backgroundColor: hex }}
                  />
                  <span>{hex}</span>
                  <button
                    onClick={() => handleRemoveColor(hex)}
                    className="text-white/40 hover:text-red-400 font-bold ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeColorInput}
                  onChange={(e) => setActiveColorInput(e.target.value)}
                  className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="text-xs px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 cursor-pointer font-medium"
                >
                  + Add Color
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Base Anchor Product Image */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A47E] flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Product Anchor Image
              </span>
              {product.baseImageUrl && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Anchor Ready
                </span>
              )}
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              Generating or uploading a master hero shot gives Nano-Banana a visual reference anchor to guarantee 100% product consistency across all advertising mediums.
            </p>

            {/* Anchor Image Preview Container */}
            <div className="relative aspect-square rounded-lg bg-[#1A1A1D] border border-white/10 overflow-hidden flex items-center justify-center group">
              {product.baseImageUrl ? (
                <>
                  <img
                    src={product.baseImageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <p className="text-xs font-semibold text-white">Visual Reference Anchor</p>
                    <label className="text-xs px-3 py-1.5 rounded bg-[#C5A47E] text-black font-semibold hover:bg-[#D5B48E] cursor-pointer">
                      Replace Image
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#C5A47E] mx-auto flex items-center justify-center">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80">No Hero Anchor Yet</p>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      Generate one using Nano-Banana or upload your own product photo.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons for Anchor Image */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={onGenerateAnchorImage}
              disabled={isGeneratingAnchor || !product.name || !product.description}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded bg-[#C5A47E] text-black font-semibold text-xs hover:bg-[#D5B48E] shadow-lg shadow-[#C5A47E]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isGeneratingAnchor ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin" />
                  <span>Rendering Hero Anchor with Nano-Banana...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Master Anchor Image</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-white/50 px-1">
              <label className="hover:text-[#C5A47E] cursor-pointer flex items-center gap-1 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Photo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Human-Free Guarantee Banner */}
      <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#C5A47E] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-[#C5A47E] uppercase tracking-wider text-[11px]">Strict Zero-Human Protocol Enforced</span>
          <p className="text-white/50 leading-relaxed">
            Per campaign requirements, all generated advertisement shots across billboards, newspapers, and social posts strictly exclude people, mannequins, and hands. Output will strictly focus on pure product staging and architectural integration.
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Info className="w-4 h-4 text-[#C5A47E]" />
          <span>Next: Select advertising mediums for batch rendering</span>
        </div>

        <button
          onClick={onNextStep}
          disabled={!product.name || !product.description}
          className="flex items-center gap-2 px-6 py-3 rounded bg-[#C5A47E] hover:bg-[#D5B48E] text-black font-semibold text-xs transition-colors shadow-lg shadow-[#C5A47E]/10 disabled:opacity-50 cursor-pointer"
        >
          <span>Choose Advertising Mediums</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
