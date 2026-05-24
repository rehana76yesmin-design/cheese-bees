/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  ArrowRight, 
  Menu as MenuIcon, 
  X, 
  Clock, 
  Sparkles, 
  Check, 
  Calendar, 
  Users, 
  Utensils,
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';
import FullscreenMenuPage from './components/FullscreenMenuPage';
import CinematicBackground from './components/CinematicBackground';

interface MenuItem {
  id: string;
  title: string;
  price: number;
  originalPriceNum: number;
  priceString: string;
  img: string;
  desc: string;
  category: 'platters' | 'steaks' | 'specialties';
  spiceOptions: string[];
}

interface QuickBooking {
  id: string;
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  guests: number;
  sittingArea: string;
  specialRequest?: string;
  createdAt: string;
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isFullScreenMenuOpen, setIsFullScreenMenuOpen] = useState<boolean>(false);
  
  // Menu items interactive state
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'platters' | 'steaks' | 'specialties'>('all');
  const [selectedSpiceLevels, setSelectedSpiceLevels] = useState<Record<string, string>>({
    't-bone': 'Traditional Spice',
    'mixed-grill': 'Medium Smoked',
    'special-rice': 'Traditional Spice'
  });
  
  // Custom interactive cart/platter calculator
  const [cart, setCart] = useState<Array<{ item: MenuItem; quantity: number; selectedSpice: string }>>([]);
  const [bookingList, setBookingList] = useState<QuickBooking[]>([]);
  
  // Form Reservation State
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '07:00 PM',
    guests: 4,
    sittingArea: 'Sky View Deck',
    specialRequest: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  
  // Menu details
  const menuItems: MenuItem[] = [
    {
      id: 't-bone',
      category: 'steaks',
      title: "T-Bone Steak",
      price: 1850,
      originalPriceNum: 1850,
      priceString: "৳ 1,850",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000",
      desc: "Premium slow-aged cut served sizzled with rich artisanal pasta, roasted garlic bulbs, & pan-sautéed seasonal heritage greens.",
      spiceOptions: ["Mild Butter Herb", "Medium Smoked", "Spicy Charcoal Burn"]
    },
    {
      id: 'mixed-grill',
      category: 'platters',
      title: "Mixed Grill Platter",
      price: 2400,
      originalPriceNum: 2400,
      priceString: "৳ 2,400",
      img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=1000",
      desc: "The ultimate sharing experience: slow-charred Seekh kababs, succulent Boti skewers, and signature grilled premium chops with dip.",
      spiceOptions: ["Traditional Spice", "Medium Heat", "Extreme Gunpowder"]
    },
    {
      id: 'special-rice',
      category: 'specialties',
      title: "Horais Special Rice",
      price: 850,
      originalPriceNum: 850,
      priceString: "৳ 850",
      img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=1000",
      desc: "Aromatic basmati rice layered with royal saffron blends, premium ghee, caramelized spring shallots, and toasted nuts.",
      spiceOptions: ["Traditional Spice", "Mild Saffron Infusion"]
    },
    {
      id: 'tengri-trio',
      category: 'platters',
      title: "Elite Tengri Platter",
      price: 1550,
      originalPriceNum: 1550,
      priceString: "৳ 1,550",
      img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=1600",
      desc: "Fresh, juicy drumsticks marinated overnight in thick Greek yogurt and a secret rich Mughal 15-spice blend, char-grilled to gold.",
      spiceOptions: ["Creamy Garlic", "Mughal Spicy", "Dhaka Blast"]
    }
  ];

  useEffect(() => {
    // Cinematic Loader Timer
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2200);

    // Hydrate existing bookings from localStorage if available
    try {
      const saved = localStorage.getItem('horais_dine_bookings');
      if (saved) {
        setBookingList(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Local storage error:", e);
    }

    return () => clearTimeout(timer);
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) return;

    const newBooking: QuickBooking = {
      id: Math.random().toString(36).substring(2, 9),
      name: bookingForm.name,
      phone: bookingForm.phone,
      date: bookingForm.date,
      timeSlot: bookingForm.timeSlot,
      guests: bookingForm.guests,
      sittingArea: bookingForm.sittingArea,
      specialRequest: bookingForm.specialRequest,
      createdAt: new Date().toLocaleTimeString()
    };

    const updatedList = [newBooking, ...bookingList];
    setBookingList(updatedList);
    localStorage.setItem('horais_dine_bookings', JSON.stringify(updatedList));

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBookingOpen(false);
      // Reset name/phone
      setBookingForm(prev => ({ ...prev, name: '', phone: '', specialRequest: '' }));
    }, 2800);
  };

  const deleteBooking = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookingList.filter(b => b.id !== id);
    setBookingList(updated);
    localStorage.setItem('horais_dine_bookings', JSON.stringify(updated));
  };

  // Add Item to Plate Order
  const addToCart = (item: MenuItem) => {
    const spice = selectedSpiceLevels[item.id] || item.spiceOptions[0] || 'Default';
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id && i.selectedSpice === spice);
      if (existing) {
        return prev.map(i => i.item.id === item.id && i.selectedSpice === spice 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      return [...prev, { item, quantity: 1, selectedSpice: spice }];
    });
  };

  const removeFromCart = (itemId: string, spice: string) => {
    setCart(prev => prev.filter(i => !(i.item.id === itemId && i.selectedSpice === spice)));
  };

  const cartTotal = cart.reduce((total, entry) => total + (entry.item.price * entry.quantity), 0);
  const vatAmount = cartTotal * 0.05; // 5% VAT
  const grandTotal = cartTotal + vatAmount;

  // Filter items
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-transparent text-[#EADBC8]/90 font-sans antialiased overflow-x-hidden selection:bg-gold-500/30 selection:text-gold-500">
      
      {/* GLOBAL CINEMATIC BACKDROP */}
      <CinematicBackground />

      {/* 1. CINEMATIC LOADER */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            id="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="font-serif text-5xl md:text-7xl tracking-[0.25em] text-white mb-2 font-light">
                HORAIS DINE
              </h1>
              <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-gold-500/60 to-transparent mx-auto mt-6" />
              
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] tracking-[0.4em] text-slate-400 uppercase">
                <Sparkles className="w-3 h-3 text-gold-500 animate-pulse" />
                <span>Luxury on Top</span>
                <Sparkles className="w-3 h-3 text-gold-500 animate-pulse" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. STICKY NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 to-black/0 h-32 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center bg-black/45 backdrop-blur-md border-b border-white/[0.03] mt-2 md:mt-4 mx-2 md:mx-auto rounded-xl">
            <div className="flex flex-col cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="font-serif text-xl tracking-[0.15em] text-white font-medium">HORAIS DINE</span>
            <span className="text-[9px] tracking-[0.3em] text-gold-500 uppercase font-light flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full shadow-[0_0_8px_rgba(212,178,111,0.5)] animate-pulse"></span>
              Luxury on Top
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-12 text-[11px] uppercase tracking-[0.22em] font-medium text-slate-400 items-center">
            {['Home', 'Menu', 'Experience', 'Contact'].map((item) => (
              item === 'Menu' ? (
                <button 
                  key={item} 
                  id="navbar-menu-btn-desktop"
                  onClick={() => setIsFullScreenMenuOpen(true)}
                  className="hover:text-gold-500 transition-all duration-300 relative group py-1 cursor-pointer font-medium uppercase tracking-[0.22em] flex items-center gap-1 bg-transparent border-0 outline-none"
                >
                  <span>{item}</span>
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full opacity-65 group-hover:opacity-100 group-hover:scale-125 transition-all"></span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold-500 transition-all duration-300 group-hover:w-full" />
                </button>
              ) : (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="hover:text-gold-500 transition-all duration-300 relative group py-1"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold-500 transition-all duration-300 group-hover:w-full" />
                </a>
              )
            ))}
          </nav>

          {/* Table Reservation and Hamburger Control */}
          <div className="flex items-center gap-4">
            <button 
              id="book-btn-desktop"
              onClick={() => setIsBookingOpen(true)}
              className="px-5 py-2.5 bg-gold-600 hover:bg-gold-500 text-black shadow-lg shadow-gold-500/25 border border-neutral-800/85 font-semibold text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all duration-500 rounded-md active:translate-y-0.5"
            >
              Book Table
            </button>

            {/* Mobile menu trigger */}
            <button 
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-drawer"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#080809]/98 backdrop-blur-md flex flex-col justify-between p-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-serif text-lg tracking-widest text-white block">HORAIS DINE</span>
                <span className="text-[8px] tracking-[0.3em] text-gold-500 block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full shadow-[0_0_8px_rgba(212,178,111,0.5)]"></span>
                  LUXURY ON TOP
                </span>
              </div>
              <button 
                id="close-mobile-drawer"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-neutral-900 rounded-full text-slate-400 hover:text-white focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-8 text-2xl font-serif py-12">
              {['Home', 'Menu', 'Experience', 'Contact'].map((item) => (
                item === 'Menu' ? (
                  <button 
                    key={item} 
                    id="navbar-menu-btn-mobile"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsFullScreenMenuOpen(true);
                    }}
                    className="text-left text-slate-300 hover:text-gold-500 tracking-wider flex items-center justify-between cursor-pointer w-full bg-transparent border-0 outline-none p-0"
                  >
                    <span className="flex items-center gap-2">
                      {item}
                      <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
                    </span>
                    <ChevronRight className="w-5 h-5 text-gold-500" />
                  </button>
                ) : (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-300 hover:text-gold-500 tracking-wider flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <ChevronRight className="w-5 h-5 text-gold-500" />
                  </a>
                )
              ))}
            </nav>

            <div className="border-t border-slate-800/80 pt-8 gap-4 flex flex-col">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsBookingOpen(true);
                }}
                className="w-full py-4 text-center bg-gold-600 hover:bg-gold-500 text-black font-semibold uppercase tracking-widest text-xs rounded-md shadow-lg shadow-gold-500/25"
              >
                Book Table Now
              </button>
              <div className="text-center text-[11px] text-gray-500">
                Reserving Rooftop Floor 8, Banasree
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HERO SECTION */}
      <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
        {/* Background Zoom / Fade in Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Deep black cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#050505]/45 to-[#010102]/95 z-10" />
          {/* Warm golden spotlight flare effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,178,111,0.09)_0%,transparent_65%)] z-10 pointer-events-none" />
          <img 
            src="https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=1600"
            alt="Cinematic Kababs On Charcoal Grill" 
            className="w-full h-full object-cover scale-105 filter brightness-[0.62] contrast-[1.08] saturate-[0.9]"
          />
        </div>

        <div className="relative z-20 text-center px-6 max-w-4xl pt-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gold-500/25 bg-gold-600/5 rounded-full mb-6"
          >
            <Sparkles className="w-3 h-3 text-gold-500" />
            <span className="text-[10px] md:text-xs text-gold-500 tracking-[0.25em] uppercase font-semibold">8th Floor Rooftop Banasree</span>
          </motion.div>

          <motion.h2 
            initial={{ y: 80, opacity: 0 }}
            animate={isLoaded ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-6xl md:text-9xl text-white mb-6 leading-none"
          >
            Taste the <span className="italic text-gold-500 block md:inline font-light selection:text-white">Magic</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 1.1 }}
            className="text-gray-300 font-light tracking-[0.3em] uppercase text-xs md:text-sm max-w-2xl mx-auto leading-relaxed"
          >
            Elevated luxury Dining Experiences in the Heart of Dhaka • Dhaka's Ultimate Skyline Kitchen
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <a 
              href="#menu"
              className="px-6 py-3 bg-gold-600 hover:bg-gold-500 text-black font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-md shadow-lg shadow-gold-500/10"
            >
              Explore Menu
            </a>
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="px-6 py-3 border border-neutral-800 text-slate-350 hover:border-gold-550 hover:text-gold-500 font-semibold text-xs uppercase tracking-widest bg-neutral-900/40 hover:bg-neutral-900/70 transition-all duration-300 rounded-md"
            >
              Book Sky Cabin
            </button>
          </motion.div>
        </div>

        {/* Scroll down indicator */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 2.2 }}
           className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 text-[10px] uppercase tracking-[0.3em] flex flex-col items-center gap-4 cursor-pointer"
           onClick={() => {
             document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
           }}
        >
          <span>Scroll to Explore</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-gold-500 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* 3.1 ROOFTOP SKY-EXPERIENCE SECTION (ABOUT) */}
      <section 
        id="experience" 
        className="relative py-32 px-6 md:px-20 overflow-hidden bg-gradient-to-b from-transparent via-[#0e0d0c]/45 to-transparent border-t border-b border-white/[0.02]"
      >
        {/* Soft blurred glow accents specifically for About Section */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full filter blur-[150px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-950/20 rounded-full filter blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Visual Frame - Luxury fine dining view */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold-500/10 shadow-2xl shadow-black group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=1200" 
                alt="Horais Dine Luxury Skyline View" 
                className="w-full h-full object-cover grayscale-[0.15] group-hover:scale-105 group-hover:grayscale-0 transition-transform duration-1000" 
              />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="text-[10px] tracking-[0.3em] font-bold text-gold-500 uppercase block mb-1">THE SKY CANOPY</span>
                <p className="font-serif text-lg text-white">Banasree’s Premier Skyline Sanctuary</p>
              </div>
            </motion.div>

            {/* Content side */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-6"
            >
              <span className="text-gold-500 text-xs tracking-[0.34em] block uppercase font-bold">OUR ROOFTOP SPACE</span>
              <h3 className="font-serif text-4xl md:text-5xl text-white font-extralight leading-tight">
                An Elevated Haven of <span className="italic font-normal text-gold-500">Charcoal & Sky</span>
              </h3>
              
              <p className="text-slate-300 leading-relaxed text-sm md:text-base font-light">
                Perched gracefully on the eighth floor, Horais Dine redefines metropolitan luxury by uniting original Mughal wood-fired grilling with majestic high-altitude glasshouse designs. Every sizzle represents hours of marination and generations of secret heritage recipes.
              </p>
              
              <p className="text-slate-400 leading-relaxed text-xs md:text-sm font-light">
                Join us for exclusive dining under the skylights or open-air sky view decks. We provide high-end, eye-safe low light settings and premium seating cabins perfect for romantic anniversaries or royal business reservations.
              </p>

              <div className="pt-4 grid grid-cols-3 gap-6 border-t border-gold-500/10">
                <div>
                  <span className="font-serif text-3xl text-gold-500 block">8th</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">Rooftop Floor</span>
                </div>
                <div>
                  <span className="font-serif text-3xl text-gold-500 block">15+</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">Mughal Spices</span>
                </div>
                <div>
                  <span className="font-serif text-3xl text-gold-500 block">100%</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">Pure Ghee Marinated</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. FEATURED MENU / PROMO */}
      <section id="menu" className="relative py-32 px-6 md:px-20 bg-transparent">
        
        {/* Subtle Luxury Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full filter blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#121214] rounded-full filter blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
            
            <div className="lg:col-span-7 relative aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5] max-h-[600px] overflow-hidden rounded-xl border border-white/10 group shadow-2xl">
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-all duration-700 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200" 
                alt="Slow Smoked Special Kababs" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute bottom-6 left-6 z-20 bg-black/85 backdrop-blur-md border border-gold-500/30 p-4 rounded-lg">
                <p className="text-gold-500 text-[10px] uppercase tracking-widest font-semibold">Chef's Heritage Choice</p>
                <h4 className="font-serif text-lg text-white">Authentic Slow-Flame Char</h4>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-gold-500 tracking-[0.3em] uppercase text-[11px] mb-4 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Limited Time Royal Offer</span>
              </div>
              <h3 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-[1.15] font-light">
                Experience Kabab <br/> 
                <span className="italic font-normal text-gold-500">Like Never Before</span>
              </h3>
              <p className="text-gray-400 leading-relaxed mb-8 text-sm md:text-base">
                Exclusive Deal: Buy 2 <span className="text-white italic font-serif font-semibold">Tengri Kababs</span> and get 1 <span className="text-white italic font-serif font-semibold">Boti Kabab</span> absolutely free. Crafted with freshly-ground heritage spices, tenderized on charcoal, and slow-charred to high perfection.
              </p>

              <div className="bg-white/[0.02] border border-slate-800/60 p-5 rounded-lg mb-8">
                <div className="flex items-center gap-3 text-sm text-gold-500 font-medium mb-1">
                  <Clock className="w-4 h-4 text-gold-500" />
                  <span>Interactive Platter Calculator</span>
                </div>
                <p className="text-xs text-slate-400">
                  Select your dishes from our interactive grid below to automatically customize your pricing and view mock checkout prices.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <a 
                  href="#food-grid"
                  className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-slate-800 hover:border-gold-500 hover:text-gold-500 rounded-md text-white uppercase tracking-widest text-[11px] font-semibold transition-all duration-300"
                >
                  <span>Customize My Platter</span> 
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Menu Filtering */}
          <div id="food-grid" className="mb-12 border-b border-slate-800/60 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">Artisanal Choice</span>
              <h3 className="font-serif text-3xl md:text-4xl text-white mt-1">Metropolitan Kitchen Grid</h3>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 text-xs">
              {(['all', 'platters', 'steaks', 'specialties'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full uppercase tracking-widest text-[10px] font-medium transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-gold-500 text-black font-extrabold shadow-lg shadow-gold-500/20' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {cat === 'all' ? 'All Masterpieces' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* 5. INTERACTIVE MENU GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const activeSpice = selectedSpiceLevels[item.id] || item.spiceOptions[0];
              return (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="group relative bg-[#121214]/65 backdrop-blur-md border border-white/[0.04] p-6 hover:border-gold-500/50 hover:bg-[#161619]/90 hover:shadow-[0_0_35px_rgba(212,178,111,0.06)] transition-all duration-500 rounded-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative h-56 overflow-hidden rounded-lg mb-6 shadow-md shadow-black/80">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-500 z-10" />
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                      />
                      <span className="absolute top-3 right-3 z-20 px-3 py-1 bg-black/85 backdrop-blur-md rounded-full text-gold-500 text-[10px] font-semibold tracking-wider border border-neutral-800/60 uppercase">
                        {item.category}
                      </span>
                    </div>

                    {/* Title & Price */}
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-serif text-2xl text-white group-hover:text-gold-500 transition-colors duration-300">{item.title}</h4>
                      <span className="text-gold-500 font-serif text-lg tracking-wider font-semibold whitespace-nowrap bg-gold-500/5 px-2.5 py-0.5 border border-gold-550/20 rounded">
                        {item.priceString}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 font-light">{item.desc}</p>

                    {/* Spice Level Selector */}
                    <div className="border-t border-slate-800/40 pt-4 mb-6">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2 font-bold">
                        Spice profile / Rub:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {item.spiceOptions.map((spice) => (
                          <button
                            key={spice}
                            onClick={() => setSelectedSpiceLevels(prev => ({ ...prev, [item.id]: spice }))}
                            className={`px-2.5 py-1 text-[9px] uppercase tracking-wider rounded border transition-all duration-300 cursor-pointer ${
                              activeSpice === spice
                                ? 'bg-gold-500/10 border-gold-500 text-gold-500 font-semibold shadow-inner'
                                : 'bg-transparent border-neutral-800/60 text-slate-500 hover:border-slate-705'
                            }`}
                          >
                            {spice}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Add to Plate Plate Button */}
                  <div>
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-full py-2.5 bg-neutral-900 hover:bg-gold-500 hover:text-black border border-neutral-800 hover:border-transparent text-white font-semibold text-[10px] uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all duration-500 active:scale-98 cursor-pointer"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Add to Plate Reservation</span>
                    </button>
                    
                    <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-gold-600 to-gold-500 transition-all duration-700 mt-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5.1 PRESTIGE REVIEWS (TESTIMONIALS SECTION) */}
      <section 
        id="testimonials" 
        className="relative py-32 px-6 md:px-20 overflow-hidden bg-transparent"
      >
        {/* Soft premium glow specifically for Testimonials Section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(212,178,111,0.04)_0%,transparent_70%)] pointer-events-none filter blur-[120px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-2">
            <span className="text-gold-500 text-xs tracking-[0.3em] font-bold block uppercase">PRESTIGE GUEST JOURNAL</span>
            <h3 className="font-serif text-3xl md:text-5xl text-white font-light">
              Voices of <span className="italic text-gold-500 font-normal">Sovereignty</span>
            </h3>
            <p className="text-slate-400 text-xs tracking-wider uppercase font-light">REAL INSIGHTS FROM DHAKA’S FINE DINING PATRONS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The seared T-Bone is a revelation of flavour, with perfect oak wood smoke undertones. The 8th-floor skyline is absolute poetry.",
                author: "Nafisa Kamal",
                title: "Culinary Editor",
                stars: 5
              },
              {
                quote: "Never felt such care in kabab preparation. The ghee marination on the Elite Tengri Platter melts in your mouth. High modern luxury at its finest.",
                author: "Zarif Rahman",
                title: "Prestige Member",
                stars: 5
              },
              {
                quote: "A sublime fusion of Mughal history and scenic modern glasshouse cabin design. Excellent eye-safe golden ambient lighting style.",
                author: "Tanvir Ahmed",
                title: "Rooftop Critic",
                stars: 5
              }
            ].map((entry, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative bg-white/[0.02] backdrop-blur-xl border border-white/[0.04] p-8 rounded-2xl flex flex-col justify-between hover:border-gold-500/20 group transition-all duration-500"
              >
                {/* Glowing border decor */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="space-y-4">
                  {/* Gold Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: entry.stars }).map((_, i) => (
                      <span key={i} className="text-gold-500 text-xs">★</span>
                    ))}
                  </div>
                  <p className="text-slate-300 italic text-sm md:text-base font-light leading-relaxed">
                    "{entry.quote}"
                  </p>
                </div>

                <div className="pt-6 border-t border-white/[0.03] mt-6 flex justify-between items-center">
                  <div>
                    <span className="font-serif text-sm text-white block">{entry.author}</span>
                    <span className="text-[10px] tracking-wider text-slate-500 uppercase">{entry.title}</span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-gold-500/30 group-hover:text-gold-500 transition-colors duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FLOATING CART AND PLATE SUMMARY */}
      {cart.length > 0 && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 right-6 z-40 max-w-sm w-full mx-auto bg-[#121214]/95 backdrop-blur-lg border border-gold-500/30 shadow-2xl p-6 rounded-xl text-white"
        >
          <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-500 shadow-[0_0_8px_rgba(212,178,111,0.5)]"></span>
              </span>
              <h5 className="font-serif text-md tracking-wider text-white">Your Platter Order</h5>
            </div>
            <button 
              onClick={() => setCart([])}
              className="text-xs text-gray-500 hover:text-red-400 cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-2 mb-4 scrollbar-thin">
            {cart.map((entry, index) => (
              <div key={`${entry.item.id}-${entry.selectedSpice}`} className="flex justify-between items-center text-xs">
                <div className="space-y-0.5">
                  <span className="font-medium text-white">{entry.item.title}</span>
                  <div className="text-[10px] text-gold-500 font-light italic">🌶️ {entry.selectedSpice}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">x{entry.quantity}</span>
                  <span className="text-gray-300 font-mono">৳ {(entry.item.price * entry.quantity).toLocaleString()}</span>
                  <button 
                    onClick={() => removeFromCart(entry.item.id, entry.selectedSpice)}
                    className="text-gray-600 hover:text-red-400 font-bold p-1 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800/40 pt-3 space-y-1.5 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono">৳ {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (5%)</span>
              <span className="font-mono">৳ {vatAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300 border-t border-slate-800/40 pt-1.5 font-bold">
              <span>Total Bill (Estimate)</span>
              <span className="font-mono text-gold-500">৳ {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              setIsBookingOpen(true);
              setBookingForm(prev => ({
                ...prev,
                specialRequest: `Include plate reservation: ${cart.map(i => `${i.item.title} (x${i.quantity}, ${i.selectedSpice})`).join(', ')}. Estimate: ৳ ${grandTotal}`
              }));
            }}
            className="w-full mt-4 py-2.5 bg-gold-600 hover:bg-gold-500 text-black font-semibold uppercase tracking-widest text-[10px] rounded-lg transition-all duration-300 shadow-md shadow-gold-500/20 cursor-pointer"
          >
            Finalize with Reservation
          </button>
        </motion.div>
      )}

      {/* RESERVATIONS STATE VIEWER */}
      {bookingList.length > 0 && (
        <section className="py-20 bg-transparent border-t border-b border-white/[0.02]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">Self-Service Portal</span>
              <h3 className="font-serif text-3xl text-white mt-1">Your Live Sky-Cabins Reservation</h3>
              <p className="text-slate-400 text-xs mt-2">Manage your current active rooftop bookings locally.</p>
            </div>

            <div className="space-y-4">
              {bookingList.map((booking) => (
                <div 
                  key={booking.id} 
                  className="bg-[#121214] border border-gold-500/15 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gold-500/35 transition-all duration-300"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{booking.name}</span>
                      <span className="px-2 py-0.5 bg-gold-500/10 text-[10px] text-gold-500 border border-gold-500/20 rounded font-medium">
                        {booking.sittingArea}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex flex-wrap gap-y-1 gap-x-4">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold-500" /> {booking.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold-500" /> {booking.timeSlot}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gold-500" /> {booking.guests} Guests</span>
                    </div>
                    {booking.specialRequest && (
                      <div className="bg-white/[0.01] p-2 rounded text-[11px] text-slate-500 italic mt-2 border-l border-gold-500/30">
                        "{booking.specialRequest}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/40">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-650 block">ID: #{booking.id.toUpperCase()}</span>
                      <span className="text-[11px] text-gold-500 flex items-center gap-1 justify-end font-medium">
                        <Check className="w-3 h-3 text-gold-500" /> Confirmed
                      </span>
                    </div>
                    <button 
                      onClick={(e) => deleteBooking(booking.id, e)}
                      className="text-xs text-slate-400 hover:text-red-400 border border-neutral-800/80 hover:border-red-500/20 px-3 py-1.5 rounded-lg bg-white/[0.01] cursor-pointer"
                    >
                      Cancel Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. CONTACT & FOOTER */}
      <footer id="contact" className="relative bg-gradient-to-t from-[#010103] via-[#040405] to-[#08080a]/90 pt-32 pb-12 border-t border-white/[0.02] px-6 md:px-20 overflow-hidden">
        
        {/* Abstract Backdrop Logo */}
        <div className="absolute right-0 bottom-0 select-none pointer-events-none opacity-[0.015] font-serif text-[18vw] leading-none text-white tracking-widest font-black">
          HORAIS
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            
            <div className="lg:col-span-4">
              <h4 className="font-serif text-3xl mb-4 text-white">Horais Dine</h4>
              <p className="text-slate-400 font-light leading-relaxed text-sm mb-6 max-w-sm">
                "Luxury on Top" — A culinary sanctuary where traditional Mughal spices and robust charcoal flame meet high modern sophistication, hosted gracefully on the 8th floor of Banasree.
              </p>
              
              <div className="flex items-center gap-2 text-xs text-gold-500 mb-2 font-medium">
                <Clock className="w-4 h-4 text-gold-500" />
                <span>Operating Hours:</span>
              </div>
              <p className="text-xs text-slate-500 font-light pl-6">
                Daily: 12:00 PM – 11:30 PM (Kitchen closes 11:00 PM)
              </p>
            </div>

            <div className="lg:col-span-5">
              <h5 className="uppercase tracking-[0.25em] text-[11px] text-gold-500 mb-6 font-bold">Contact & Reservations</h5>
              <div className="flex flex-col gap-5 text-slate-300 text-sm">
                
                <a 
                  href="tel:01898934170" 
                  className="flex items-center gap-3.5 hover:text-gold-500 transition-colors duration-300 w-fit cursor-pointer"
                >
                  <Phone className="w-5 h-5 text-gold-500 shrink-0" /> 
                  <span className="font-medium">01898-934170</span>
                </a>

                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed">
                    House 7 (8th Floor), Road 12, Main Road,<br/> 
                    Beside South Banasree Central Jame Masjid,<br/> 
                    Khilgaon, Dhaka, Bangladesh
                  </p>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setIsBookingOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gold-500/25 rounded bg-gold-500/5 text-gold-500 text-xs hover:bg-gold-600 hover:text-black transition-all duration-300 shadow-md shadow-gold-500/10 cursor-pointer"
                  >
                    <span>Instant Maps Directions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

            <div className="lg:col-span-3">
              <h5 className="uppercase tracking-[0.25em] text-[11px] text-gold-500 mb-6 font-bold">Social Connections</h5>
              <p className="text-xs text-slate-500 mb-4 leading-normal font-light">
                Follow our official accounts for Chef specials, dining events, and views of Banasree from the top.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 bg-white/5 hover:bg-gold-550/20 border border-white/5 hover:border-gold-500/20 rounded-full text-slate-300 hover:text-gold-500 transition-all duration-300"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 bg-white/5 hover:bg-gold-550/20 border border-white/5 hover:border-gold-500/20 rounded-full text-slate-300 hover:text-gold-500 transition-all duration-300"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest gap-4">
            <p>© 2024–2026 Horais Dine. All Prices exclusive of 5% VAT.</p>
            <p className="text-gray-600 font-light">Elevated Rooftop Culinary Sanctuary • Dhaka</p>
          </div>
        </div>
      </footer>

      {/* 7. CUSTOM TABLE BOOKING DRAWER MODAL */}
      <AnimatePresence>
        {isBookingOpen && (
          <div 
            id="modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop lock */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-lg bg-[#121214] border border-gold-500/30 rounded-2xl shadow-2xl p-6 md:p-8 z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600" />
              
              <button 
                id="close-booking-modal"
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6 text-center">
                <span className="text-gold-500 text-[10px] tracking-[0.3em] uppercase block mb-1 font-bold">RESERVATIONS PORTAL</span>
                <h4 className="font-serif text-3xl text-white">Secure Luxury Table</h4>
                <p className="text-xs text-slate-400 mt-1">Floor 8 Rooftop • Scenic Skylights</p>
              </div>

              {bookingSuccess ? (
                <div id="booking-success-indicator" className="text-center py-10 space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gold-500/15 border border-gold-500 rounded-full flex items-center justify-center text-gold-500 animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <h5 className="font-serif text-2xl text-white">Table Confirmed!</h5>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    We have registered your session. Your table ID is reserved locally. Present this screen upon greeting on the 8th floor.
                  </p>
                </div>
              ) : (
                <form id="reservation-form" onSubmit={handleBookingSubmit} className="space-y-4">
                  
                  {/* Row 1: Name */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1 font-semibold">Your Full Name:</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rehana Yesmin"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#18181c] border border-neutral-800/80 focus:border-gold-500 focus:outline-none p-3 rounded-lg text-sm text-white placeholder-neutral-600"
                    />
                  </div>

                  {/* Row 2: Phone */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1 font-semibold">Mobile Number for Confirmation:</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. 01898-934170"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-[#18181c] border border-neutral-800/80 focus:border-gold-500 focus:outline-none p-3 rounded-lg text-sm text-white placeholder-neutral-600"
                    />
                  </div>

                  {/* Row 3: Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1 font-semibold">Select Date:</label>
                      <input 
                        type="date" 
                        required
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-[#18181c] border border-neutral-800/80 focus:border-gold-500 focus:outline-none p-3 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1 font-semibold">Prestige Session:</label>
                      <select 
                        value={bookingForm.timeSlot}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                        className="w-full bg-[#18181c] border border-neutral-800/80 focus:border-gold-500 focus:outline-none p-3 rounded-lg text-xs text-white"
                      >
                        <option value="12:30 PM">12:30 PM (Lunch)</option>
                        <option value="02:30 PM">02:30 PM (Snooze)</option>
                        <option value="06:00 PM">06:00 PM (Sunset)</option>
                        <option value="07:30 PM">07:30 PM (Prime Dinner)</option>
                        <option value="09:00 PM">09:00 PM (Late Deck)</option>
                        <option value="10:30 PM">10:30 PM (Midnight Skyline)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Guests & Seating cabin */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1 font-semibold">Guest Count ({bookingForm.guests}):</label>
                      <input 
                        type="range"
                        min="1"
                        max="16"
                        value={bookingForm.guests}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
                      />
                      <span className="text-[10px] text-slate-500 block text-right mt-1">{bookingForm.guests} Prestige Seats</span>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1 font-semibold">Space Layout:</label>
                      <select 
                        value={bookingForm.sittingArea}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, sittingArea: e.target.value }))}
                        className="w-full bg-[#18181c] border border-neutral-800/80 focus:border-gold-500 focus:outline-none p-3 rounded-lg text-xs text-white"
                      >
                        <option value="Sky View Deck">Sky View Deck (Rooftop Open Air)</option>
                        <option value="Glasshouse Cabin">Glasshouse Cabin (AC Indoor luxury)</option>
                        <option value="Sunset Lounge">Sunset Lounge (West facing VIP balcony)</option>
                        <option value="Family Majestic Area">Family Majestic Area</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional request, e.g. birthday decoration, platter notes */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1 font-semibold">Special Request / custom notes:</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Birthday anniversary package setup, extra spicy rub, or include steak details..."
                      value={bookingForm.specialRequest}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequest: e.target.value }))}
                      className="w-full bg-[#18181c] border border-neutral-800/80 focus:border-gold-500 focus:outline-none p-3 rounded-lg text-xs text-slate-300 placeholder-neutral-600"
                    />
                  </div>

                  {/* Submit Table Reservation Action */}
                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-gold-600 hover:bg-gold-500 text-black font-extrabold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-gold-500/25 active:translate-y-0.5 transition-all duration-300 cursor-pointer"
                    >
                      Confirm Rooftop Reservation
                    </button>
                    <div className="flex items-center gap-1.5 justify-center mt-3 text-[9px] text-slate-500">
                      <Info className="w-3.5 h-3.5 text-gold-500" />
                      <span>Instant confirmation token is cached locally on this browser.</span>
                    </div>
                  </div>

                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FullscreenMenuPage 
        isOpen={isFullScreenMenuOpen} 
        onClose={() => setIsFullScreenMenuOpen(false)} 
      />

    </div>
  );
}
