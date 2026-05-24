import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { X, ArrowRight, Sparkles, Sliders, Image as ImageIcon, Camera } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'flame' | 'aged' | 'royal' | 'sweet';
  categoryLabel: string;
  img: string;
  vintage: string;
  notes: string;
}

interface FullscreenMenuPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const GALLERY_PHOTOS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Slow-Flame T-Bone Seared on Oak',
    category: 'aged',
    categoryLabel: 'Aged & Fire-Seared',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200',
    vintage: 'Dry-Aged 45 Days',
    notes: 'Premium Angus beef cut, hand-massaged with pink rock salt and seared on natural charcoal flame.'
  },
  {
    id: 'g-2',
    title: 'The Mughal Emperor Shish Platter',
    category: 'flame',
    categoryLabel: 'Charcoal & Smoke',
    img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=1200',
    vintage: 'Smoked over Hickory',
    notes: 'Traditional tender minced skewers seasoned with freshly crushed cardamom, mace and wild saffron.'
  },
  {
    id: 'g-3',
    title: 'Crown Grilled Lamb Chops with Mint Glaze',
    category: 'aged',
    categoryLabel: 'Aged & Fire-Seared',
    img: 'https://images.unsplash.com/photo-1600891964599-f61ba0edd2a0?auto=format&fit=crop&q=80&w=1200',
    vintage: 'Heritage Farms',
    notes: 'Exquisite slow-roasted double cut ribs glazed with garden-grown mint reductions and wild honey.'
  },
  {
    id: 'g-4',
    title: 'Himalayan Pink Salt Crusted Salmon Plating',
    category: 'royal',
    categoryLabel: 'Royal Specialties',
    img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1200',
    vintage: 'Fresh Glacier Catch',
    notes: 'Pan-browned high-fat river salmon resting on a bed of butter-poached organic parsnip purée.'
  },
  {
    id: 'g-5',
    title: 'Golden Saffron Ghee-Infused Pulao',
    category: 'royal',
    categoryLabel: 'Royal Specialties',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=1200',
    vintage: 'Basmati Special Reserve',
    notes: 'Aromatic long-grains steamed in organic copper urns with golden saffron stems, cashew oil and rose dew.'
  },
  {
    id: 'g-6',
    title: 'Hot Lava Chocolate Fondant with Pistachio Dust',
    category: 'sweet',
    categoryLabel: 'Sweet & Infused',
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=1200',
    notes: 'Decadent 72% dark Belgian chocolate core paired with freshly churned Madagascan vanilla pod isolate.',
    vintage: 'Artisanal Batch #09'
  },
  {
    id: 'g-7',
    title: 'Smoked Grapefruit Sour Cocktail',
    category: 'sweet',
    categoryLabel: 'Sweet & Infused',
    img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200',
    notes: 'Hand-pressed citrus juice infused with single-barrel botanical gin and dynamic hickory wood smoke.',
    vintage: 'Mixology Selection'
  },
  {
    id: 'g-8',
    title: 'Ocean Harvest Oyster Platter on Dry Ice',
    category: 'royal',
    categoryLabel: 'Royal Specialties',
    img: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&q=80&w=1200',
    notes: 'Freshly shucked premium oysters served with traditional shallot mignonette and cold pressed finger limes.',
    vintage: 'Hand-Sorted Daily'
  },
  {
    id: 'g-9',
    title: 'Tengri Flame-Charred Chicken Skewers',
    category: 'flame',
    categoryLabel: 'Charcoal & Smoke',
    img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=1200',
    notes: 'Marinated overnight with whole cream yogurt, dried fenugreek leaves, and local cold-press mustard oil.',
    vintage: 'Chef Signature Rub'
  }
];

export default function FullscreenMenuPage({ isOpen, onClose }: FullscreenMenuPageProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'flame' | 'aged' | 'royal' | 'sweet'>('all');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredID, setHoveredID] = useState<string | null>(null);
  const [selectedImageDetail, setSelectedImageDetail] = useState<GalleryItem | null>(null);

  // Custom inertial cursor springs
  const cursorX = useSpring(0, { damping: 30, stiffness: 200 });
  const cursorY = useSpring(0, { damping: 30, stiffness: 200 });

  // Floating ambient light particles tracking
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    // Generate background embers
    const tempParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5
    }));
    setParticles(tempParticles);
  }, []);

  // Update mouse coordinate tracker for cursor follower
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  // Lock scroll bar on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const filteredPhotos = selectedTab === 'all' 
    ? GALLERY_PHOTOS 
    : GALLERY_PHOTOS.filter(photo => photo.category === selectedTab);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="fullscreen-menu-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[120] bg-[#030304] text-slate-100 overflow-y-auto flex flex-col justify-start"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Global Backdrop Gradients & Texture */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-[#08080a] via-[#040405] to-[#010102]">
            {/* Soft gold ambient glow of rich golden light */}
            <div className="absolute top-1/4 -left-10 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/8 to-gold-500/5 rounded-full filter blur-[150px] animate-pulse" />
            <div className="absolute bottom-1/3 -right-10 w-[700px] h-[700px] bg-[#D4B26F]/8 rounded-full filter blur-[180px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-[radial-gradient(circle_at_center,rgba(92,64,33,0.12)_0%,transparent_70%)] rounded-full filter blur-[200px]" />
            
            {/* Grain Noise Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.018] mix-blend-overlay"
              style={{
                backgroundSize: '220px 220px',
                backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='noiseFilter'><feTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%2523noiseFilter)'/></svg>")`
              }}
            />

            {/* Vignette Shading */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(3,3,4,0.85)_100%)]" />
            
            {/* Drifty Embers Particles */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-gradient-to-t from-amber-500/25 to-transparent shadow-[0_0_8px_rgba(212,178,111,0.35)]"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                animate={{
                  y: [-300, 300],
                  x: [-50, 50],
                  opacity: [0.08, 0.35, 0.08],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: p.delay
                }}
              />
            ))}
          </div>

          {/* CUSTOM INERTIAL CURSOR FOLLOWER */}
          <div className="hidden lg:block pointer-events-none">
            <motion.div
              className={`fixed top-0 left-0 z-[300] w-12 h-12 rounded-full border border-gold-500/40 pointer-events-none flex items-center justify-center transition-all duration-300 ${
                hoveredID ? 'w-24 h-24 bg-gold-600/10 border-gold-500/70 scale-110 shadow-lg shadow-gold-500/10' : ''
              }`}
              style={{ x: cursorX, y: cursorY }}
            >
              {hoveredID && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="text-[8px] font-mono tracking-[0.2em] font-black text-gold-500"
                >
                  VIEW
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* TOP BAR / NAVIGATION CODES */}
          <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-black via-[#050505]/95 to-transparent px-6 py-6 md:px-12 md:py-8 border-b border-white/[0.02]">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              
              <div 
                className="flex items-center gap-4 cursor-pointer"
                onClick={onClose}
              >
                <div className="flex flex-col">
                  <span className="font-serif text-lg tracking-[0.25em] text-white">HORAIS DINE</span>
                  <span className="text-[8px] tracking-[0.35em] text-gold-500 font-bold uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full shadow-[0_0_8px_rgba(212,178,111,0.5)]"></span>
                    SIGHTS & MASTERPIECES
                  </span>
                </div>
              </div>

              {/* Close Overlay Controller */}
              <button
                id="close-gallery-fullscreen"
                onClick={onClose}
                className="group relative px-5 py-2.5 bg-white/5 hover:bg-gold-600 border border-neutral-800 hover:border-transparent text-slate-300 hover:text-black font-semibold text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all duration-500 rounded-lg flex items-center gap-2 active:translate-y-0.5 shadow-lg shadow-black/80"
              >
                <span>Back To Deck</span>
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
              </button>

            </div>
          </header>

          {/* MAIN PAGE WRAPPER */}
          <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12 md:px-12 flex-grow flex flex-col justify-center">
            
            {/* INTRO HERO HEADINGS */}
            <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full"
              >
                <Sparkles className="w-3 h-3 text-gold-500" />
                <span className="text-[9px] tracking-[0.3em] uppercase text-gold-500 font-bold">Immersive Sensory Mode</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-4xl md:text-7xl leading-tight font-extralight text-white"
              >
                The Culinary <span className="italic font-light text-gold-500 block md:inline">Visual Journey</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="text-xs md:text-sm text-slate-400 tracking-[0.25em] uppercase font-light leading-relaxed max-w-2xl mx-auto"
              >
                Feast with your eyes first. An elite curated portfolio of our wood-fired, slow-caramelized masterpieces.
              </motion.p>
            </div>

            {/* GALLERY FILTER TABS */}
            <div id="gallery-tabs-selector" className="flex items-center justify-center mb-12 select-none overflow-x-auto pb-4 scrollbar-none">
              <div className="bg-black/45 backdrop-blur-md p-1.5 rounded-full border border-neutral-800/80 flex gap-1.5 shrink-0">
                {[
                  { value: 'all', label: 'All Visuals' },
                  { value: 'flame', label: 'The Charcoal Flame' },
                  { value: 'aged', label: 'Dry-Aged Cuts' },
                  { value: 'royal', label: 'Mughal Royal Selection' },
                  { value: 'sweet', label: 'Fine Confections & Nectars' }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedTab(tab.value as any)}
                    className={`px-5 py-2.5 rounded-full text-[10px] md:text-[11px] uppercase tracking-widest font-semibold transition-all duration-300 ${
                      selectedTab === tab.value
                        ? 'bg-gold-500 text-black font-extrabold shadow-md shadow-gold-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DYNAMIC GRID GALLERY */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="relative group cursor-pointer aspect-[4/5] bg-[#121214]/65 backdrop-blur-md rounded-2xl overflow-hidden border border-white/[0.04] hover:border-gold-500/50 hover:shadow-[0_0_35px_rgba(212,178,111,0.06)] shadow-xl transition-all duration-700 select-none flex flex-col justify-end"
                    onClick={() => setSelectedImageDetail(photo)}
                    onMouseEnter={() => setHoveredID(photo.id)}
                    onMouseLeave={() => setHoveredID(null)}
                  >
                    {/* Dark gradient shadow cover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5 group-hover:via-black/10 transition-all duration-700 z-10 pointer-events-none" />

                    {/* Gourmet Image */}
                    <img
                      src={photo.img}
                      alt={photo.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover grayscale-[0.1] contrast-[1.05] brightness-[0.88] group-hover:scale-110 group-hover:grayscale-0 transition-transform duration-[1200ms] ease-[0.16, 1, 0.3, 1]"
                    />

                    {/* Left Frame Decor border */}
                    <div className="absolute inset-4 border border-white/5 rounded-xl pointer-events-none group-hover:border-gold-500/20 transition-all duration-700 z-20" />

                    {/* Minimalist Details block */}
                    <div className="relative z-20 p-6 space-y-2 pointer-events-none">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-gold-500">
                          {photo.categoryLabel}
                        </span>
                        <span className="text-[8px] font-mono text-slate-500 uppercase">
                          {photo.vintage}
                        </span>
                      </div>
                      
                      <h3 className="font-serif text-xl text-white font-light group-hover:text-gold-500 transition-colors duration-500">
                        {photo.title}
                      </h3>

                      <div className="flex items-center gap-2 pt-2 text-[9px] text-gold-500 font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Click to view ingredients</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

          </main>

          {/* BACK TO MAIN PAGE DECK FOOTER */}
          <footer id="gallery-footer" className="relative z-10 w-full px-6 py-12 border-t border-white/[0.02] bg-gradient-to-t from-[#010103] via-[#040405] to-transparent mt-16 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest gap-6">
            <div className="flex items-center gap-3">
              <Camera className="w-4 h-4 text-gold-500" />
              <span>HORAIS DINE ROOFTOP FINE GALLERY</span>
            </div>
            <p>© Live-viewing from Floor 8. Book table for actual experience.</p>
          </footer>

          {/* SUB-MODAL FOR INDIVIDUAL LIGHTBOX/DETAIL CARD */}
          <AnimatePresence>
            {selectedImageDetail && (
              <div id="detail-modal" className="fixed inset-0 z-[250] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedImageDetail(null)}
                  className="absolute inset-0 bg-black/95 backdrop-blur-md"
                />

                <motion.div
                  initial={{ scale: 0.93, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.93, opacity: 0, y: 15 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-4xl bg-[#08080a]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12"
                >
                  {/* Image side */}
                  <div className="md:col-span-7 relative h-72 md:h-[500px] overflow-hidden">
                    <img
                      src={selectedImageDetail.img}
                      alt={selectedImageDetail.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-[#08080a]/20" />
                  </div>

                  {/* Text Details side */}
                  <div className="md:col-span-5 p-6 md:p-10 flex flex-col justify-between bg-[#0B0B0D]/80 backdrop-blur-md">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tracking-[0.3em] text-gold-500 uppercase font-black">
                          {selectedImageDetail.categoryLabel}
                        </span>
                        <button
                          onClick={() => setSelectedImageDetail(null)}
                          className="p-1 px-2.5 bg-white/5 text-slate-400 hover:text-white rounded-md text-xs font-mono border border-neutral-800 hover:bg-gold-600 hover:text-black transition-colors"
                        >
                          ✕
                        </button>
                      </div>

                      <h2 className="font-serif text-3xl md:text-4xl text-white font-extralight leading-tight">
                        {selectedImageDetail.title}
                      </h2>

                      <div className="h-[1px] w-20 bg-gold-500/30" />

                      <p className="text-sm text-slate-300 leading-relaxed font-light">
                        {selectedImageDetail.notes}
                      </p>

                      <div className="space-y-2 pt-2">
                        <div className="text-[9px] uppercase tracking-widest text-slate-500">Premium Profile Source</div>
                        <div className="text-xs text-gold-500 font-mono flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>{selectedImageDetail.vintage}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 flex flex-col gap-3">
                      <button
                        onClick={() => {
                          setSelectedImageDetail(null);
                          onClose();
                          // Scroll to reservation table
                          const bookBtn = document.getElementById('book-btn-desktop') || document.getElementById('mobile-menu-trigger');
                          bookBtn?.click();
                        }}
                        className="w-full py-3 bg-gold-600 hover:bg-gold-500 text-black font-semibold uppercase tracking-widest text-[10px] rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gold-550/15"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span>Reserve Platter Session</span>
                      </button>
                      
                      <button
                        onClick={() => setSelectedImageDetail(null)}
                        className="w-full py-2.5 bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-250 uppercase tracking-widest text-[9px] transition-colors"
                      >
                        Return to Visuals
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
