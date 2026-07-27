import JSZip from 'jszip';
import { CampaignProject, GeneratedAsset } from '../types';

/**
 * Helper to convert base64 data URL to Uint8Array for JSZip
 */
function dataURLToUint8Array(dataUrl: string): Uint8Array | null {
  try {
    const arr = dataUrl.split(',');
    if (arr.length < 2) return null;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return u8arr;
  } catch (err) {
    console.error('Failed to convert base64 image data:', err);
    return null;
  }
}

/**
 * Export campaign assets as a organized high-resolution ZIP file
 */
export async function exportCampaignAsZip(
  project: CampaignProject,
  selectedAssets?: GeneratedAsset[]
): Promise<void> {
  const zip = new JSZip();
  const sanitizeName = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();

  const brandFolderName = sanitizeName(project.product.name || 'brand_builder');
  const folder = zip.folder(brandFolderName) || zip;

  const assetsToExport = selectedAssets && selectedAssets.length > 0 ? selectedAssets : project.assets;

  if (assetsToExport.length === 0) {
    throw new Error('No images available to export in ZIP file.');
  }

  // Create manifest file inside zip
  const manifest = {
    brandName: project.product.name,
    tagline: project.product.tagline,
    category: project.product.category,
    materials: project.product.materials,
    description: project.product.description,
    exportedAt: new Date().toISOString(),
    aiModel: project.nanoModel || 'gemini-3.1-flash-lite-image (Nano-Banana)',
    totalAssets: assetsToExport.length,
    assets: assetsToExport.map((a, idx) => ({
      index: idx + 1,
      mediumName: a.mediumName,
      mediumId: a.mediumId,
      aspectRatio: a.aspectRatio,
      prompt: a.prompt,
      model: a.model,
      filename: `${String(idx + 1).padStart(2, '0')}_${sanitizeName(a.mediumName)}_${a.aspectRatio.replace(':', 'x')}.png`
    }))
  };

  folder.file('campaign_manifest.json', JSON.stringify(manifest, null, 2));
  folder.file(
    'README.txt',
    `==================================================
${project.product.name.toUpperCase()} - BRAND CAMPAIGN ASSET SET
==================================================
Generated with: Brand Builder App (Nano-Banana Model)
Date: ${new Date().toLocaleString()}

BRAND OVERVIEW:
- Product Name: ${project.product.name}
- Tagline: "${project.product.tagline}"
- Category: ${project.product.category}
- Materials & Finish: ${project.product.materials}

ASSETS INCLUDED (${assetsToExport.length} total):
${assetsToExport.map((a, i) => `${i + 1}. [${a.mediumName}] - ${a.aspectRatio} Aspect Ratio`).join('\n')}

Note: All assets were rendered with strict product consistency and zero humans/people in frame.
`
  );

  // Add each image to the ZIP
  assetsToExport.forEach((asset, index) => {
    const u8 = dataURLToUint8Array(asset.imageUrl);
    if (u8) {
      const fileName = `${String(index + 1).padStart(2, '0')}_${sanitizeName(asset.mediumName)}_${asset.aspectRatio.replace(':', 'x')}.png`;
      folder.file(fileName, u8);
    }
  });

  // Generate the zip blob and trigger download
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const downloadUrl = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${brandFolderName}_campaign_highres_assets.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
