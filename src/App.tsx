import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { categories, destinationsList, beaches, activities, practicalInfo, culturalEvents } from './data';
import { MapPin, Calendar, X, ExternalLink, Menu, Globe, ChevronDown, Check, Sparkles, Plane, Sun, Bus, Utensils, Maximize2, Clock } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, useApiLoadingStatus, APILoadingStatus } from '@vis.gl/react-google-maps';
import { i18n, languages, Language } from './i18n';
import { GoogleGenAI } from '@google/genai';
import regeneratedImage1 from './assets/images/regenerated_image_1778682985339.webp';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('EN');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const t = i18n[lang];

  // Dynamic SEO Data
  const seoData = {
    title: selectedItem 
      ? `${selectedItem.name} | Tenerife South Guide`
      : `${t[activeTab as keyof typeof t] || 'Guide'} | Tenerife South`,
    description: selectedItem
      ? selectedItem.description
      : t.heroSubtitle,
  };

  // Structured Data (JSON-LD)
  const structuredData = selectedItem ? {
    "@context": "https://schema.org",
    "@type": selectedItem.lat ? "Place" : "TouristAttraction",
    "name": selectedItem.name,
    "description": selectedItem.description,
    "image": selectedItem.image,
    ...(selectedItem.lat && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": selectedItem.lat,
        "longitude": selectedItem.lng
      }
    })
  } : {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Tenerife South Travel Guide",
    "description": t.heroSubtitle,
    "url": window.location.href
  };

  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-white p-8 font-sans">
        <div className="text-center max-w-lg border border-white/10 p-12 bg-white/5">
          <h2 className="text-2xl font-light mb-6 text-[#F27D26]">Google Maps API Key Required</h2>
          <p className="text-[#F27D26]/80 bg-[#F27D26]/10 border border-[#F27D26]/20 p-4 font-light text-sm mb-6 text-left">
            <strong>Important:</strong> You need an API key with the <strong>Maps JavaScript API</strong> activated in your Google Cloud Console.
          </p>
          <p className="text-white/60 mb-4 font-light text-sm"><strong>Step 1:</strong> <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener" className="underline text-white">Get a Maps API Key</a></p>
          <p className="text-white/60 mb-2 font-light text-sm"><strong>Step 2:</strong> Add your key as a secret in AI Studio:</p>
          <ul className="text-left text-white/50 text-xs space-y-2 inline-block bg-white/5 p-4 border border-white/10">
            <li>Open <strong>Settings</strong> (⚙️ gear icon, <strong>top-right corner</strong>)</li>
            <li>Select <strong>Secrets</strong></li>
            <li>Type <code>GOOGLE_MAPS_PLATFORM_KEY</code> as the secret name, press <strong>Enter</strong></li>
            <li>Paste your API key as the value, press <strong>Enter</strong></li>
          </ul>
          <p className="text-[#F27D26]/70 mt-6 text-xs tracking-widest uppercase">The app rebuilds automatically.</p>
        </div>
      </div>
    );
  }

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans flex flex-col overflow-x-hidden relative">
        {/* Background Decorative Element */}
        <div className="fixed top-20 right-[-100px] w-[600px] h-[600px] bg-gradient-to-br from-[#F27D26]/10 to-transparent rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* Hero Section */}
        <header className="relative w-full flex flex-col justify-end px-8 pt-24 pb-12 z-10 max-w-6xl mx-auto">
          <div className="flex justify-between items-end border-b border-white/10 pb-8 mb-8">
             <div className="text-[10px] tracking-[0.4em] font-bold uppercase text-[#F27D26]">Tenerife // South</div>
             
             <div className="flex items-center gap-6">
                <div className="relative">
                  <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center gap-2 text-[10px] tracking-widest text-white/60 hover:text-white transition-colors"
                  >
                    <Globe size={14} />
                    <span>{lang}</span>
                    <ChevronDown size={10} />
                  </button>
                  
                  <AnimatePresence>
                    {isLangMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-[#111] border border-white/10 p-2 shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 gap-1">
                          {languages.map((l) => (
                            <button
                              key={l.code}
                              onClick={() => {
                                setLang(l.code);
                                setIsLangMenuOpen(false);
                              }}
                              className={`flex items-center justify-between px-3 py-2 text-[9px] uppercase tracking-widest hover:bg-white/5 transition-colors ${
                                lang === l.code ? 'text-[#F27D26]' : 'text-white/60'
                              }`}
                            >
                              {l.name}
                              {lang === l.code && <Check size={10} />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-[10px] tracking-widest text-white/50">TFS</div>
             </div>
          </div>

          <div className="relative leading-none mb-8">
            <h1 className="text-[100px] md:text-[180px] lg:text-[240px] font-black uppercase tracking-tighter leading-[0.8] mix-blend-lighten text-white">
              TENER<br/>IFE
            </h1>
            <span className="absolute top-1/2 left-[40%] md:left-[580px] -translate-y-1/2 text-[80px] md:text-[140px] lg:text-[180px] font-thin italic text-[#F27D26] opacity-90 leading-none">
              {t.south}
            </span>
          </div>
          
          <p className="text-xs md:text-[11px] text-white/40 max-w-md uppercase tracking-[0.2em] font-medium leading-relaxed">
            {t.heroSubtitle}
          </p>
        </header>

        {/* Navigation */}
        <div className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-md border-y border-white/10">
          <div className="max-w-6xl mx-auto px-8 flex justify-between items-center h-16 md:h-auto gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex overflow-x-auto hide-scrollbar py-4 flex-grow">
              <div className="flex gap-8 min-w-max">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeTab === category.id;
                  const label = t[category.id as keyof typeof t] || category.label;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleTabChange(category.id)}
                      className={`flex items-center gap-2 text-[10px] tracking-[0.2em] font-medium uppercase transition-all ${
                        isActive 
                          ? 'text-white border-b-2 border-[#F27D26] pb-1' 
                          : 'text-white/50 hover:text-white pb-1'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'text-[#F27D26]' : 'text-white/30'} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Search Input */}
            <div className="flex-grow max-w-xs relative hidden sm:block">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/30">
                <Menu size={14} className="rotate-90" />
              </div>
              <input
                type="text"
                placeholder={lang === 'EN' ? "Search..." : "Buscar..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 py-1.5 pl-10 pr-4 text-[10px] uppercase tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-[#F27D26]/50 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-3 flex items-center text-white/30 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Mobile Navigation Header */}
            <div className="flex md:hidden items-center justify-between w-full h-full py-4">
              <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-white/70">
                {t[activeTab as keyof typeof t] || categories.find(c => c.id === activeTab)?.label}
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white active:scale-95 transition-all"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 md:hidden bg-[#0A0A0A] flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="text-[10px] tracking-[0.4em] font-bold uppercase text-[#F27D26]">Menu</div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-col gap-8">
                {categories.map((category, idx) => {
                  const Icon = category.icon;
                  const isActive = activeTab === category.id;
                  const label = t[category.id as keyof typeof t] || category.label;
                  
                  return (
                    <motion.button
                      key={category.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleTabChange(category.id)}
                      className={`flex items-center gap-6 text-3xl font-light tracking-tight text-left transition-all ${
                        isActive ? 'text-[#F27D26]' : 'text-white/40'
                      }`}
                    >
                      <Icon size={24} strokeWidth={1} />
                      {label}
                    </motion.button>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-white/10 pt-8 text-[9px] tracking-[0.5em] text-white/30 uppercase">
                Tenerife // South // Guide
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-8 py-16 min-h-[50vh] w-full z-10 relative">
          {/* Mobile Search - Only visible on smallest screens */}
          <div className="sm:hidden mb-8 relative">
            <input
              type="text"
              placeholder={lang === 'EN' ? "Search..." : "Buscar..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 py-3 pl-10 pr-4 text-[10px] uppercase tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-[#F27D26]/50"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/30">
              <Menu size={14} className="rotate-90" />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-white/30"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && <OverviewSection t={t} onImageClick={setFullScreenImage} />}
              {activeTab === 'destinations' && <DestinationsSection onSelect={setSelectedItem} t={t} searchQuery={searchQuery} />}
              {activeTab === 'beaches' && <BeachesSection onSelect={setSelectedItem} t={t} searchQuery={searchQuery} />}
              {activeTab === 'activities' && <ActivitiesSection onSelect={setSelectedItem} t={t} searchQuery={searchQuery} />}
              {activeTab === 'agenda' && <AgendaSection onSelect={setSelectedItem} t={t} searchQuery={searchQuery} />}
              {activeTab === 'practical' && <PracticalSection t={t} />}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Footer */}
        <footer className="p-8 flex justify-between items-end border-t border-white/5 z-10 relative bg-[#0A0A0A]">
          <div className="flex flex-col gap-4 md:flex-row md:gap-16">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase opacity-30 mb-1 tracking-widest text-[#F27D26]">{t.elevation}</span>
              <span className="text-xs font-mono text-white/60">3,715m (Mount Teide)</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase opacity-30 mb-1 tracking-widest text-[#F27D26]">{t.timezone}</span>
              <span className="text-xs font-mono text-white/60">WET (UTC+0)</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase opacity-30 mb-1 tracking-widest text-[#F27D26]">{t.currentTime}</span>
              <span className="text-xs font-mono text-white/60">
                {currentTime.toLocaleTimeString('en-GB', { 
                  timeZone: 'Atlantic/Canary', 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase opacity-30 mb-1 tracking-widest text-[#F27D26]">{t.hub}</span>
              <span className="text-xs font-mono text-white/60">Reina Sofía Airport</span>
            </div>
          </div>
          <div className="text-[9px] tracking-[0.5em] text-white/30 uppercase hidden md:block">
            Islands / Canary / Spain
          </div>
        </footer>

        {/* Detail Modal Overlay */}
        <AnimatePresence>
          {selectedItem && (
            <ItemDetailModal 
              item={selectedItem} 
              onClose={() => setSelectedItem(null)} 
              lang={lang}
              t={t}
            />
          )}
        </AnimatePresence>

        {/* Global Full Screen Image Viewer */}
        <AnimatePresence>
          {fullScreenImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFullScreenImage(null)}
              className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            >
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={fullScreenImage}
                alt="Full screen view"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
              <button 
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                onClick={() => setFullScreenImage(null)}
              >
                <X size={32} strokeWidth={1} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </APIProvider>
  );
}

function ItemDetailModal({ item, onClose, lang, t }: { item: any; onClose: () => void; lang: Language; t: any }) {
  const [translatedContent, setTranslatedContent] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const translateContent = async () => {
    if (lang === 'EN') return;
    setIsTranslating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Translate the following travel information about ${item.name} into ${languages.find(l => l.code === lang)?.name}. 
      Keep the JSON structure exactly as provided. Return ONLY the JSON.
      Input JSON: ${JSON.stringify({
        detailedDescription: item.detailedDescription,
        highlights: item.highlights,
        travelTips: item.travelTips,
        howToGetThere: item.howToGetThere,
        localSecret: item.localSecret,
        atmosphere: item.type || "Resort",
        bestTime: item.bestTime,
        suitability: item.suitability,
        whatToBring: item.whatToBring,
        nearbyRecommendations: item.nearbyRecommendations,
        safetyTips: item.safetyTips,
        schedule: item.schedule
      })}`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const text = result.text;
      if (text) {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          setTranslatedContent(JSON.parse(match[0]));
        }
      }
    } catch (error) {
      console.error("Translation failed", error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Auto-translate if not EN
  useEffect(() => {
    if (lang !== 'EN') {
      translateContent();
    }
  }, [lang, item.name]);

  const [isFullScreenImageOpen, setIsFullScreenImageOpen] = useState(false);
  const display = translatedContent || item;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
      >
        <div className="absolute inset-0 z-0" onClick={onClose} />
        
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative z-10 w-full max-w-2xl h-full bg-[#0A0A0A] border-l border-white/10 flex flex-col overflow-y-auto"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20 backdrop-blur-md rounded-full"
          >
            <X size={18} />
          </button>
   
          <div 
            className="h-64 md:h-80 w-full flex-shrink-0 relative cursor-pointer group/img overflow-hidden"
            onClick={() => setIsFullScreenImageOpen(true)}
          >
            <img 
              src={item.image} 
              alt={item.name} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
              <div className="bg-black/50 backdrop-blur-md border border-white/20 p-3 rounded-full text-white">
                <ExternalLink size={20} />
              </div>
            </div>
          </div>

        <div className="px-8 py-8 flex-grow pb-24">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block">
              {item.type || item.price ? t.details : t.destinations} 
              {item.location ? ` // ${item.location}` : ''}
            </span>
            
            {lang !== 'EN' && !translatedContent && (
              <button 
                onClick={translateContent}
                disabled={isTranslating}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded text-[9px] uppercase tracking-widest text-[#F27D26] disabled:opacity-50 transition-all"
              >
                {isTranslating ? (
                   <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                     <Sparkles size={10} />
                   </motion.div>
                ) : <Sparkles size={10} />}
                {isTranslating ? "..." : `AI Translate to ${lang}`}
              </button>
            )}
          </div>
          
          <h2 className="text-4xl text-white font-light tracking-tight mb-6">{item.name}</h2>
          
          {item.date && (
            <div className="flex items-center gap-3 mb-8 bg-[#F27D26]/10 border border-[#F27D26]/20 px-4 py-3 rounded-sm">
              <Calendar size={18} className="text-[#F27D26]" />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block leading-none mb-1">Event Date</span>
                <span className="text-sm text-white font-medium">{item.date}</span>
              </div>
            </div>
          )}

          <p className="text-white/80 font-light leading-relaxed mb-10 text-lg">
            {display.detailedDescription}
          </p>

          <div className="space-y-12">
            {display.schedule && (
              <div className="border-t border-white/10 pt-8">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-6 flex items-center gap-2">
                  <Clock size={12} /> {lang === 'EN' ? 'Daily Program' : 'Programa Diario'}
                </span>
                <div className="space-y-4">
                  {display.schedule.map((slot: string, i: number) => {
                    const [time, ...activity] = slot.split(' - ');
                    return (
                      <div key={i} className="flex gap-4 group/slot">
                        <div className="w-20 flex-shrink-0 text-[11px] font-mono text-[#F27D26] bg-[#F27D26]/5 border border-[#F27D26]/10 flex items-center justify-center h-7 rounded-sm">
                          {time}
                        </div>
                        <div className="text-sm font-light text-white/70 group-hover/slot:text-white transition-colors flex items-center">
                          {activity.join(' - ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {display.highlights && (
              <div className="border-t border-white/10 pt-8">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-4">{t.highlights}</span>
                <div className="flex flex-wrap gap-2">
                  {display.highlights.map((h: string, i: number) => (
                    <span key={i} className="text-xs font-light text-white px-3 py-1 border border-white/10 bg-white/5">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-white/10 pt-8">
              {(item.type || display.atmosphere) && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-2">{t.atmosphere}</span>
                  <p className="text-sm font-light text-[#F27D26]">{display.atmosphere || item.type}</p>
                </div>
              )}
              {item.price && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-2">{t.price}</span>
                  <p className="text-sm font-light text-white bg-white/5 inline-block px-3 py-1 border border-white/10">{item.price}</p>
                </div>
              )}
              {display.bestTime && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-2">{t.bestTime}</span>
                  <p className="text-sm font-light text-white/70">{display.bestTime}</p>
                </div>
              )}
              {display.suitability && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-2">{t.suitability}</span>
                  <p className="text-sm font-light text-white/70">{display.suitability}</p>
                </div>
              )}
            </div>

            {/* Travel Sections */}
            <div className="space-y-12 border-t border-white/10 pt-8">
              {display.whatToBring && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-3">{t.whatToBring}</span>
                  <div className="flex flex-wrap gap-2">
                    {display.whatToBring.map((item: string, i: number) => (
                      <span key={i} className="text-[11px] font-mono text-white/50 border border-white/5 px-2 py-1">
                        + {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {display.nearbyRecommendations && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-3">{t.nearbyRecommendations}</span>
                  <div className="grid gap-2">
                    {display.nearbyRecommendations.map((rec: string, i: number) => (
                      <div key={i} className="text-sm font-light text-white/70 flex items-center gap-3">
                        <div className="w-1 h-1 bg-[#F27D26] rounded-full" />
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {display.howToGetThere && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-3">{t.howToGetThere}</span>
                  <p className="text-sm font-light text-white/60 leading-relaxed">{display.howToGetThere}</p>
                </div>
              )}

              {display.travelTips && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-3">{t.travelTips}</span>
                  <div className="space-y-3">
                    {display.travelTips.map((tip: string, i: number) => (
                      <div key={i} className="flex gap-3 text-sm font-light text-white/70">
                        <span className="text-[#F27D26]">/</span>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {display.safetyTips && (
                <div className="border-l-2 border-yellow-500/30 pl-4 py-1">
                  <span className="text-[10px] uppercase tracking-widest text-yellow-500/70 font-bold block mb-2">{t.safetyTips}</span>
                  <p className="text-sm font-light text-white/60 italic leading-relaxed">{display.safetyTips}</p>
                </div>
              )}

              {display.localSecret && (
                <div className="bg-[#F27D26]/5 border border-[#F27D26]/20 p-6">
                  <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-2">{t.localSecret}</span>
                  <p className="text-sm font-light text-white italic">"{display.localSecret}"</p>
                </div>
              )}

              {item.officialLink && (
                <div className="pt-4">
                  <a 
                    href={item.officialLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 bg-[#F27D26] hover:bg-[#d96a1a] text-black text-[10px] font-bold uppercase tracking-widest px-6 py-3 transition-colors rounded-sm"
                  >
                    {t.officialSite} <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>

            {item.lat && item.lng && (
              <div className="border-t border-white/10 pt-8 pb-12">
                <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4 flex items-center gap-2">
                  <MapPin size={12} /> {t.location}
                </span>
                <div className="h-[300px] w-full border border-white/10 bg-[#111] overflow-hidden">
                  <POIMap item={item} />
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-white/40 font-mono">
                  <span>{item.lat.toFixed(4)}° N, {Math.abs(item.lng).toFixed(4)}° W</span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-[#F27D26] transition-colors"
                  >
                    Open in Google Maps <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>

    <AnimatePresence>
      {isFullScreenImageOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFullScreenImageOpen(false)}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
        >
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-full object-contain shadow-2xl"
          />
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            onClick={() => setIsFullScreenImageOpen(false)}
          >
            <X size={32} strokeWidth={1} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

function POIMap({ item }: { item: any }) {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center h-full gap-2 border border-red-500/30 bg-red-500/10 m-2">
        <span className="text-red-400 font-bold mb-1">Google Maps Auth Error</span>
        <span className="text-sm font-light text-white/80">The Maps API could not load.</span>
        <span className="text-xs text-white/50">
          Make sure the <strong>Maps JavaScript API</strong> is enabled for your API key in Google Cloud Console.
        </span>
      </div>
    );
  }

  return (
    <Map
      defaultCenter={{ lat: item.lat, lng: item.lng }}
      defaultZoom={14}
      mapId="POI_MAP_ID"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      disableDefaultUI={true}
      style={{ width: '100%', height: '100%' }}
    >
      <AdvancedMarker position={{ lat: item.lat, lng: item.lng }} title={item.name}>
        <Pin background="#F27D26" borderColor="#0A0A0A" glyphColor="#fff" scale={1.2} />
      </AdvancedMarker>
    </Map>
  );
}

function OverviewSection({ t, onImageClick }: { t: any; onImageClick: (src: string) => void }) {
  return (
    <article className="grid md:grid-cols-2 gap-16 items-start">
      <div className="flex flex-col gap-8">
        <header>
          <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4">{t.overview}</span>
          <h2 className="text-4xl text-white font-light leading-tight">{t.welcomeTitle}</h2>
        </header>
        
        <p className="text-white/60 font-light leading-relaxed text-sm">
          {t.welcomeText1}
        </p>
        <p className="text-white/60 font-light leading-relaxed text-sm">
          {t.welcomeText2}
        </p>
        
        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 mt-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold flex items-center gap-2"><Calendar size={12}/> {t.bestTime}</span>
            <p className="text-2xl font-light text-white leading-tight">Sep &mdash; Nov</p>
            <span className="text-[11px] text-white/40 mt-1 uppercase tracking-tighter italic">{t.bestTimeSub}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold flex items-center gap-2"><MapPin size={12}/> {t.vibe}</span>
            <p className="text-2xl font-light text-white leading-tight">Sunny &amp; Varied</p>
            <span className="text-[11px] text-white/40 mt-1 uppercase tracking-tighter italic">{t.vibeSub}</span>
          </div>
        </div>
      </div>
      
      <div className="relative group/canvas">
        <div 
          className="aspect-[3/4] border border-white/10 overflow-hidden relative cursor-zoom-in"
          onClick={() => onImageClick(regeneratedImage1)}
        >
           <img 
            src={regeneratedImage1} 
            alt="Palms overlooking the ocean in Las Américas" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80 group-hover/canvas:opacity-100 group-hover/canvas:scale-105 transition-all duration-1000"
          />
          <div className="absolute top-4 left-4 bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/10 px-3 py-1 text-[9px] uppercase tracking-widest text-white/70">
            Las Américas
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/canvas:opacity-100 transition-opacity bg-black/20">
            <div className="bg-black/50 backdrop-blur-md border border-white/20 p-4 rounded-full text-white">
              <Maximize2 size={24} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function DestinationsSection({ onSelect, t, searchQuery }: { onSelect: (item: any) => void; t: any; searchQuery: string }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Luxury', 'Party', 'Traditional', 'Bohemian'];

  const filteredDestinations = destinationsList.filter(dest => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = dest.name.toLowerCase().includes(searchStr) || 
                         dest.description.toLowerCase().includes(searchStr) ||
                         dest.detailedDescription.toLowerCase().includes(searchStr) ||
                         dest.highlights.some(h => h.toLowerCase().includes(searchStr));
    
    const vibe = dest.name === 'Costa Adeje' ? 'Luxury' :
                 dest.name === 'Playa de las Américas' ? 'Party' :
                 dest.name === 'Los Cristianos' ? 'Traditional' :
                 dest.name === 'El Médano' ? 'Bohemian' : 'All';

    const matchesFilter = activeFilter === 'All' || vibe === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <article>
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4">{t.destinations}</span>
          <h2 className="text-4xl text-white font-light leading-tight max-w-xl">{t.townsTitle}</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-[9px] uppercase tracking-widest transition-all ${
                activeFilter === filter 
                  ? 'bg-[#F27D26] text-black font-bold' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>
      
      <div className="grid sm:grid-cols-2 gap-12 border-t border-white/10 pt-12">
        <AnimatePresence mode="popLayout">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((dest, idx) => {
              // Map to localized description if available
              let description = dest.description;
              if (dest.name === 'Costa Adeje') description = t.adejeDesc;
              if (dest.name === 'Playa de las Américas') description = t.americasDesc;
              if (dest.name === 'Los Cristianos') description = t.cristianosDesc;
              if (dest.name === 'El Médano') description = t.medanoDesc;

              return (
                <motion.section 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={dest.name} 
                  className="group flex flex-col gap-4 cursor-pointer"
                  onClick={() => onSelect(dest)}
                >
                  <div className="h-[300px] overflow-hidden border border-white/10 relative">
                    <img src={dest.image} alt={`Aerial view of ${dest.name}, Tenerife South`} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute bottom-4 right-4 bg-[#0A0A0A]/90 text-[#F27D26] text-[10px] uppercase px-3 py-1 border border-[#F27D26]/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.explore}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-light text-white mb-2 group-hover:text-[#F27D26] transition-colors">{dest.name}</h3>
                    <p className="text-white/60 font-light text-sm mb-6 leading-relaxed line-clamp-2">{description}</p>
                    
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold">{t.highlights}</span>
                      <div className="flex flex-col gap-1 mt-2">
                        {dest.highlights.map((highlight, hIdx) => (
                          <span key={hIdx} className="text-[11px] text-white/40 uppercase tracking-widest font-mono">
                            // {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.section>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10">
              <p className="text-white/40 font-light italic">No destinations found matching your criteria.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

function BeachesSection({ onSelect, t, searchQuery }: { onSelect: (item: any) => void; t: any; searchQuery: string }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Golden Sand', 'Dark Sand', 'Natural'];

  const filteredBeaches = beaches.filter(beach => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = beach.name.toLowerCase().includes(searchStr) || 
                          beach.description.toLowerCase().includes(searchStr) ||
                          beach.detailedDescription.toLowerCase().includes(searchStr) ||
                          beach.location.toLowerCase().includes(searchStr) ||
                          beach.type.toLowerCase().includes(searchStr);
    
    const matchesFilter = activeFilter === 'All' || beach.type.includes(activeFilter);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <article>
      <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4">{t.beaches}</span>
          <h2 className="text-4xl text-white font-light leading-tight max-w-xl">{t.beachesTitle}</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-[9px] uppercase tracking-widest transition-all ${
                activeFilter === filter 
                  ? 'bg-[#F27D26] text-black font-bold' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>
      
      <div className="grid gap-12 border-t border-white/10 pt-12">
        <AnimatePresence mode="popLayout">
          {filteredBeaches.length > 0 ? (
            filteredBeaches.map((beach, idx) => (
              <motion.section 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key={beach.name} 
                className="flex flex-col md:flex-row md:items-start gap-8 group cursor-pointer"
                onClick={() => onSelect(beach)}
              >
                <div className="flex-shrink-0 text-white/20 group-hover:text-[#F27D26] transition-colors duration-500 hidden md:block">
                  <span className="text-5xl font-black">{String(idx + 1).padStart(2, '0')}</span>
                </div>
                
                <div className="flex-grow space-y-4">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 border-b border-white/10 pb-4 group-hover:border-[#F27D26]/30 transition-colors">
                    <h3 className="text-3xl font-light text-white tracking-tight group-hover:text-[#F27D26] transition-colors">{beach.name}</h3>
                    <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold flex items-center gap-1">
                      <MapPin size={10}/> {beach.location}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8 pt-2">
                    <p className="text-white/60 font-light text-sm leading-relaxed">{beach.description}</p>
                    <div>
                       <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-2">{t.atmosphere}</span>
                       <p className="text-[11px] font-mono text-white/70 uppercase tracking-widest">{beach.type}</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex ml-auto items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] uppercase text-[#F27D26] border border-[#F27D26]/30 px-3 py-1">{t.viewInfo}</span>
                </div>
              </motion.section>
            ))
          ) : (
            <div className="py-20 text-center border border-dashed border-white/10">
              <p className="text-white/40 font-light italic">No beaches found matching your criteria.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

function ActivitiesSection({ onSelect, t, searchQuery }: { onSelect: (item: any) => void; t: any; searchQuery: string }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Nature', 'Adventure', 'Family', 'Water'];

  const filteredActivities = activities.filter(activity => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = activity.name.toLowerCase().includes(searchStr) || 
                          activity.description.toLowerCase().includes(searchStr) ||
                          activity.detailedDescription.toLowerCase().includes(searchStr);
    
    const type = activity.name === 'Whale & Dolphin Watching' ? 'Water' :
                 activity.name === 'Siam Park' ? 'Family' :
                 activity.name === 'Teide National Park' ? 'Nature' :
                 activity.name === 'Surfing in Las Américas' ? 'Adventure' : 'All';

    const matchesFilter = activeFilter === 'All' || type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <article>
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4">{t.activities}</span>
          <h2 className="text-4xl text-white font-light leading-tight max-w-xl">{t.activitiesTitle}</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-[9px] uppercase tracking-widest transition-all ${
                activeFilter === filter 
                  ? 'bg-[#F27D26] text-black font-bold' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>
      
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 border-t border-white/10 pt-12">
        <AnimatePresence mode="popLayout">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, idx) => (
              <motion.section 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={activity.name} 
                className="flex flex-col gap-4 relative group cursor-pointer"
                onClick={() => onSelect(activity)}
              >
                <div className="absolute top-0 right-0 text-white/5 text-[120px] font-black leading-none -mt-8 -mr-4 pointer-events-none group-hover:text-white/10 transition-colors">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="relative z-10 space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold border-b border-[#F27D26]/30 pb-2 inline-flex items-center justify-between w-full">
                    {t.activities}
                    <span className="text-white/40 group-hover:text-[#F27D26] opacity-0 group-hover:opacity-100 transition-all font-mono">+ {t.details}</span>
                  </span>
                  <h3 className="text-2xl font-light text-white group-hover:text-[#F27D26] transition-colors">{activity.name}</h3>
                  <p className="text-white/60 font-light text-sm leading-relaxed min-h-[4rem] line-clamp-3">{activity.description}</p>
                  
                  <div className="flex flex-col mt-4">
                     <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">{t.price}</span>
                     <p className="text-xs font-mono text-white opacity-80">{activity.price}</p>
                  </div>
                </div>
              </motion.section>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10">
              <p className="text-white/40 font-light italic">No activities found matching your criteria.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

function PracticalSection({ t }: { t: any }) {
  const practicalData = [
    { icon: Plane, title: t.airportTitle, content: t.airportText },
    { icon: Sun, title: t.weatherTitle, content: t.weatherText },
    { icon: Bus, title: t.transportTitle, content: t.transportText },
    { icon: Utensils, title: t.foodTitle, content: t.foodText },
  ];

  return (
    <article>
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4">{t.practical}</span>
        <h2 className="text-4xl text-white font-light leading-tight max-w-xl">{t.practicalTitle}</h2>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-12 border-t border-white/10 pt-12">
        {practicalData.map((info, idx) => {
          const Icon = info.icon;
          return (
            <section key={idx} className="flex gap-6 group border border-white/5 p-6 hover:border-white/20 transition-colors bg-white/[0.02]">
              <div className="flex-shrink-0 mt-1 text-[#F27D26]">
                 <Icon size={24} strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-light text-white tracking-wide">{info.title}</h3>
                <p className="text-white/60 font-light text-sm leading-relaxed">{info.content}</p>
              </div>
            </section>
          )
        })}
      </div>
    </article>
  );
}

function AgendaSection({ onSelect, t, searchQuery }: { onSelect: (item: any) => void; t: any; searchQuery: string }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4)); // Default to May 2026 for demo consistency
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeType, setActiveType] = useState('All');
  
  const types = ['All', 'Traditional', 'Festival', 'Sports', 'Market'];

  const filteredEvents = culturalEvents.filter(event => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = event.name.toLowerCase().includes(searchStr) || 
                          event.description.toLowerCase().includes(searchStr) ||
                          event.detailedDescription.toLowerCase().includes(searchStr) ||
                          event.location.toLowerCase().includes(searchStr) ||
                          event.type.toLowerCase().includes(searchStr);
    
    const matchesType = activeType === 'All' || event.type.includes(activeType);

    if (!event.dateStart) return false;
    const eventDate = parseISO(event.dateStart);
    let matchesDate = true;
    if (selectedDate) {
      matchesDate = isSameDay(eventDate, selectedDate);
    } else {
      matchesDate = isSameMonth(eventDate, currentMonth);
    }

    return matchesSearch && matchesType && matchesDate;
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <article>
      <header className="mb-12">
        <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4">{t.agenda}</span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 className="text-4xl text-white font-light leading-tight max-w-xl">{t.agendaTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-3 py-1 text-[9px] uppercase tracking-widest transition-all border ${
                  activeType === type 
                    ? 'bg-[#F27D26] text-black border-[#F27D26] font-bold' 
                    : 'bg-transparent text-white/50 border-white/10 hover:border-white/30'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
        <div className="order-2 lg:order-1">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-light text-white">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : format(currentMonth, 'MMMM yyyy')}
            </h3>
            {selectedDate && (
              <button 
                onClick={() => setSelectedDate(null)}
                className="text-[10px] uppercase tracking-widest text-[#F27D26] border border-[#F27D26]/30 px-3 py-1 hover:bg-[#F27D26]/10 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <motion.section 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={event.id} 
                    className="group flex flex-col bg-white/[0.02] border border-white/5 hover:border-[#F27D26]/30 transition-all overflow-hidden cursor-pointer h-full"
                    onClick={() => onSelect(event)}
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img 
                        src={event.image} 
                        alt={event.name} 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                      />
                      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest text-[#F27D26] border border-[#F27D26]/30">
                        {event.type}
                      </div>
                    </div>
                    <div className="p-6 space-y-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-lg font-light text-white group-hover:text-[#F27D26] transition-colors">{event.name}</h3>
                        <span className="text-[10px] font-mono text-white/40 uppercase whitespace-nowrap bg-white/5 px-2 py-0.5">{event.date}</span>
                      </div>
                      <p className="text-white/60 font-light text-xs leading-relaxed line-clamp-2 italic flex-grow">
                        {event.description}
                      </p>
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#F27D26] font-bold uppercase">
                          <MapPin size={10} />
                          {event.location}
                        </div>
                        <div className="w-1 h-1 bg-[#F27D26] animate-pulse rounded-full" />
                      </div>
                    </div>
                  </motion.section>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-sm">
                  <p className="text-white/40 font-light italic">No events scheduled for this selection.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <aside className="order-1 lg:order-2 space-y-8 sticky top-8">
          <div className="bg-white/[0.03] border border-white/10 p-6">
            <CalendarWidget 
              currentMonth={currentMonth} 
              selectedDate={selectedDate}
              onDateClick={setSelectedDate}
              onPrevMonth={prevMonth}
              onNextMonth={nextMonth}
              events={culturalEvents}
            />
          </div>

          <div className="bg-[#F27D26]/5 border border-[#F27D26]/20 p-6 space-y-4">
            <div className="flex items-center gap-3 text-[#F27D26]">
              <Sparkles size={20} strokeWidth={1} />
              <h4 className="text-white font-light text-sm tracking-tight uppercase">Local Secret</h4>
            </div>
            <p className="text-white/50 font-light text-[11px] leading-relaxed italic">
              "The south isn't just about beach clubs. Look for the 'Baile de Magos' dates—it's where the real party happens, dress code required!"
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}

function CalendarWidget({ 
  currentMonth, 
  selectedDate, 
  onDateClick, 
  onPrevMonth, 
  onNextMonth,
  events
}: { 
  currentMonth: Date; 
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  events: any[];
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const hasEvent = (day: Date) => {
    return events.some(event => event.dateStart && isSameDay(parseISO(event.dateStart), day));
  };

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onPrevMonth} className="p-1 hover:text-[#F27D26] transition-colors"><ChevronDown className="rotate-90" size={16} /></button>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={onNextMonth} className="p-1 hover:text-[#F27D26] transition-colors"><ChevronDown className="-rotate-90" size={16} /></button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-[9px] text-center text-white/30 font-bold uppercase">{day[0]}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isCurrentMonth = isSameMonth(day, monthStart);
          const hasEv = hasEvent(day);

          return (
            <button
              key={idx}
              onClick={() => onDateClick(day)}
              className={`
                aspect-square flex flex-col items-center justify-center text-[10px] relative transition-all rounded-sm
                ${!isCurrentMonth ? 'text-white/10' : 'text-white/60'}
                ${isSelected ? 'bg-[#F27D26] !text-black font-bold' : 'hover:bg-white/5'}
              `}
            >
              {format(day, 'd')}
              {hasEv && !isSelected && (
                <div className="absolute bottom-1 w-1 h-1 bg-[#F27D26] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}


