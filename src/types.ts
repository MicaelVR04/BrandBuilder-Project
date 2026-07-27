export type MediumId = 
  | 'billboard' 
  | 'newspaper' 
  | 'social_post' 
  | 'storefront' 
  | 'magazine' 
  | 'bus_shelter' 
  | 'web_banner' 
  | 'subway_poster' 
  | 'packaging';

export interface MediumConfig {
  id: MediumId;
  name: string;
  category: 'Outdoor' | 'Print' | 'Digital' | 'Retail';
  icon: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  description: string;
  promptTemplate: string;
  defaultDimensions: { width: number; height: number };
}

export interface ProductBrandInfo {
  name: string;
  category: string;
  description: string;
  colors: string[];
  tagline: string;
  materials: string;
  logoDescription?: string;
  baseImageUrl?: string; // High-res anchor image for consistency
}

export interface GeneratedAsset {
  id: string;
  mediumId: MediumId;
  mediumName: string;
  imageUrl: string;
  prompt: string;
  model: string;
  aspectRatio: string;
  createdAt: number;
  width?: number;
  height?: number;
  isFavorite?: boolean;
  version?: number;
}

export interface CampaignProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  product: ProductBrandInfo;
  assets: GeneratedAsset[];
  selectedMediums: MediumId[];
  nanoModel: 'gemini-3.1-flash-image' | 'gemini-3.1-flash-lite-image';
  isCloudSynced?: boolean;
}

export interface GenerationRequest {
  mediumId: MediumId;
  mediumName: string;
  prompt: string;
  aspectRatio: string;
  product: ProductBrandInfo;
  nanoModel: string;
  baseImageUrl?: string;
}

export interface GenerationProgress {
  mediumId: MediumId;
  mediumName: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error?: string;
  asset?: GeneratedAsset;
  startTime?: number;
  endTime?: number;
}
