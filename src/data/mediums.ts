import { MediumConfig } from '../types';

export const MEDIUMS: MediumConfig[] = [
  {
    id: 'billboard',
    name: 'Highway Billboard',
    category: 'Outdoor',
    icon: 'Maximize2',
    aspectRatio: '16:9',
    description: 'Ultra wide, high-impact highway advertorial installation with atmospheric lighting.',
    promptTemplate: 'A massive high-definition outdoor highway billboard featuring {product_name}. The product is prominently displayed in high resolution with crisp branding and tagline "{tagline}". Set against a dramatic sky at twilight. Architectural metal framing and spotlight illumination. STRICT REQUIREMENT: NO PEOPLE, NO HUMANS, NO FACES, NO MANNEQUINS, NO HANDS in the frame.',
    defaultDimensions: { width: 1920, height: 1080 }
  },
  {
    id: 'newspaper',
    name: 'Newspaper Print Ad',
    category: 'Print',
    icon: 'Newspaper',
    aspectRatio: '3:4',
    description: 'Classic high-contrast editorial newspaper advertisement with refined typography layout.',
    promptTemplate: 'A full-page print advertisement in a broadsheet newspaper showcasing {product_name}. Elegant monochrome or spot-color editorial layout with crisp columns of headline text, clean typography reading "{tagline}", and detailed product photography resting on textured paper grain. STRICT REQUIREMENT: NO PEOPLE, NO HUMANS, NO FACES, NO HANDS in the image.',
    defaultDimensions: { width: 1200, height: 1600 }
  },
  {
    id: 'social_post',
    name: 'Social Media Feed',
    category: 'Digital',
    icon: 'Share2',
    aspectRatio: '1:1',
    description: 'Clean, square social media product creative designed for high engagement and modern aesthetics.',
    promptTemplate: 'A sleek, studio-lit social media post photo highlighting {product_name}. Modern flat-lay or dynamic angle with subtle brand color accents ({colors}), elegant soft shadows, and clean modern aesthetic. Minimalist backdrop. STRICT REQUIREMENT: NO PEOPLE, NO HUMANS, NO HANDS, NO FACES in the frame.',
    defaultDimensions: { width: 1080, height: 1080 }
  },
  {
    id: 'storefront',
    name: 'Storefront Window',
    category: 'Retail',
    icon: 'Store',
    aspectRatio: '4:3',
    description: 'Luxury retail window showcase with bespoke architectural display pedestals and warm spotlights.',
    promptTemplate: 'A luxury boutique storefront glass window display showcasing {product_name} on an elevated marble pedestal. Warm museum-grade directional spotlighting, reflective glass framing, premium branding decals on the window glass, and high-end store interior in the background. STRICT REQUIREMENT: NO PEOPLE, NO HUMANS, NO FACES, NO SHOPPERS in the image.',
    defaultDimensions: { width: 1600, height: 1200 }
  },
  {
    id: 'magazine',
    name: 'Magazine Spread',
    category: 'Print',
    icon: 'BookOpen',
    aspectRatio: '3:4',
    description: 'Glossy luxury magazine full-page advertisement with refined editorial design and studio lighting.',
    promptTemplate: 'A high-fashion glossy magazine full page print creative for {product_name}. Studio lighting, satin reflection, elegant serif typography stating "{tagline}", and pristine product positioning. Clean negative space and luxurious finish. STRICT REQUIREMENT: NO PEOPLE, NO HUMANS, NO FACES, NO HANDS in the picture.',
    defaultDimensions: { width: 1200, height: 1600 }
  },
  {
    id: 'bus_shelter',
    name: 'Bus Stop Transit Ad',
    category: 'Outdoor',
    icon: 'Bus',
    aspectRatio: '9:16',
    description: 'Illuminated urban transit shelter poster box set in a modern city boulevard.',
    promptTemplate: 'An illuminated urban bus stop poster box display featuring a vertical advertisement for {product_name}. Glowing LED backlighting inside a sleek glass and aluminum frame on a clean modern city street corner at dusk. Crisp product details and brand logo. STRICT REQUIREMENT: NO PEOPLE, NO HUMANS, NO PASSENGERS, NO FACES in the scene.',
    defaultDimensions: { width: 1080, height: 1920 }
  },
  {
    id: 'web_banner',
    name: 'Digital Web Banner',
    category: 'Digital',
    icon: 'Monitor',
    aspectRatio: '16:9',
    description: 'Modern high-converting hero web banner creative for digital marketing campaigns.',
    promptTemplate: 'A high-resolution digital web hero banner creative advertising {product_name}. Clean tech interface styling with dynamic gradient backdrop matching brand colors ({colors}), floating 3D product render, tagline "{tagline}" and call-to-action button placeholder. STRICT REQUIREMENT: NO PEOPLE, NO HUMANS, NO FACES in the design.',
    defaultDimensions: { width: 1920, height: 1080 }
  },
  {
    id: 'subway_poster',
    name: 'Subway Station Poster',
    category: 'Outdoor',
    icon: 'TrainTrack',
    aspectRatio: '4:3',
    description: 'Large backlit subway platform advertising panel with industrial architectural framing.',
    promptTemplate: 'A large backlit subway platform poster frame showcasing {product_name}. Framed in polished metal mounted on a subterranean ceramic tiled station wall. Vibrant neon lighting and crisp brand typography. STRICT REQUIREMENT: NO PEOPLE, NO HUMANS, NO COMMUTERS, NO FACES in the image.',
    defaultDimensions: { width: 1600, height: 1200 }
  },
  {
    id: 'packaging',
    name: 'Retail Product Box',
    category: 'Retail',
    icon: 'Package',
    aspectRatio: '1:1',
    description: '3D luxury retail packaging box and unboxing presentation with foil stamping and debossing.',
    promptTemplate: 'A 3D unboxing product presentation featuring the official retail packaging box for {product_name}. Premium matte cardboard with foil stamped typography, metallic logo accents, and crisp product resting alongside the open box on a smooth studio surface. STRICT REQUIREMENT: NO PEOPLE, NO HUMANS, NO HANDS in the frame.',
    defaultDimensions: { width: 1080, height: 1080 }
  }
];

export const PRODUCT_PRESETS = [
  {
    name: 'AuraSound Horizon',
    category: 'Audio Tech',
    description: 'Wireless noise-canceling spatial audio headphones with brushed aluminum earcups, memory foam leather pads, and sleek copper accents.',
    tagline: 'Pure Sound. Infinite Horizon.',
    materials: 'Anodized aluminum, matte ceramic, dark leather',
    colors: ['#1A1A1A', '#C5A059', '#3B82F6'],
    logoDescription: 'Minimalist geometric wave icon inside a circle'
  },
  {
    name: 'Velox Electric Scooter',
    category: 'Urban Mobility',
    description: 'High-performance ultra-light carbon fiber foldable electric scooter with integrated dual LED light bars and hidden display screen.',
    tagline: 'Own the City Grid.',
    materials: 'Matte black carbon fiber, brushed stainless steel, orange trim',
    colors: ['#000000', '#FF5500', '#E5E7EB'],
    logoDescription: 'Stylized lightning chevron V symbol'
  },
  {
    name: 'Velvet Roast Cold Brew',
    category: 'Beverage',
    description: 'Artisanal organic dark roast cold brew coffee bottled in an amber glass apothecary flask with embossed wax seal.',
    tagline: 'Slow Brewed. Boldly Craft.',
    materials: 'Amber glass bottle, natural cork stopper, textured cream paper label',
    colors: ['#3D2314', '#D4AF37', '#FFFDF8'],
    logoDescription: 'Embossed coffee leaf crest with vintage lettering'
  },
  {
    name: 'Luminary Chrono 40',
    category: 'Luxury Watches',
    description: 'Architectural automatic watch with openwork skeleton dial, sapphire glass casing, and midnight blue alligator leather strap.',
    tagline: 'Precision Beyond Time.',
    materials: 'Titanium case, blue sapphire glass, dark navy leather',
    colors: ['#0B192C', '#E2E8F0', '#1E3E62'],
    logoDescription: 'Interlocking star compass emblem'
  }
];
