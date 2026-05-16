import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { categories, destinationsList, beaches, activities, naturalPools, practicalInfo, culturalEvents, localEats, Restaurant, nightlifeClubs } from './data';
import { MapPin, Calendar, X, ExternalLink, Menu, Globe, ChevronDown, Check, Sparkles, Plane, Sun, Bus, Utensils, Maximize2, Clock, Star, Cloud, CloudRain, CloudLightning, CloudSun, Heart, Waves, Music, Umbrella, ShowerHead, ParkingCircle, Accessibility } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, useApiLoadingStatus, APILoadingStatus } from '@vis.gl/react-google-maps';
import { i18n, languages, Language } from './i18n';
import { GoogleGenAI } from '@google/genai';
import CookieConsent from './components/CookieConsent';
import regeneratedImage1 from './assets/images/regenerated_image_1778682985339.webp';
import losCristianosGif from './assets/images/los-cristianos-bay-beach-tenerife-sur.gif';
import costAdejeGif from './assets/images/cost-adeje-beach-mountain.gif';
import abadesGif from './assets/images/abades-village-beach-mountain.gif';
import americasGif from './assets/images/playa-americas-v2.gif';
import medanoGif from './assets/images/el-medano-surf-wind.gif';
import puertoSantiagoGif from './assets/images/puerto-santiago-cliffs-view.gif';
import mascaGif from './assets/images/masca-mountain-village.gif';
import alcalaGif from './assets/images/alcala-fishing-village.gif';
import abadesTerraceJpg from './assets/images/abades-ocean-deck-house-terrace.jpg';
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
import { enUS, es, fr, de, nl, it, pt, pl, uk } from 'date-fns/locale';

const locales: Record<Language, any> = {
  EN: enUS,
  ES: es,
  FR: fr,
  DE: de,
  NL: nl,
  IT: it,
  PT: pt,
  PL: pl,
  UK: uk
};

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
  const [weather, setWeather] = useState<{temp: number, code: number} | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('beaches_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAbadesAd, setShowAbadesAd] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedItem?.name === 'Abades') {
      timer = setTimeout(() => {
        setShowAbadesAd(true);
      }, 4000); // 4 seconds delay
    } else {
      setShowAbadesAd(false);
    }
    return () => clearTimeout(timer);
  }, [selectedItem]);

  useEffect(() => {
    localStorage.setItem('beaches_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (name: string) => {
    setFavorites(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Fetch weather for TFS (Tenerife South Airport)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=28.0445&longitude=-16.5144&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data.current_weather) {
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            code: data.current_weather.weathercode
          });
        }
      })
      .catch(err => console.error("Weather fetch failed", err));

    return () => clearInterval(timer);
  }, []);

  const t = i18n[lang];

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun size={14} className="text-[#F27D26]" />;
    if (code >= 1 && code <= 3) return <CloudSun size={14} className="text-[#F27D26]" />;
    if (code >= 51 && code <= 67) return <CloudRain size={14} className="text-[#F27D26]" />;
    if (code >= 80 && code <= 82) return <CloudRain size={14} className="text-[#F27D26]" />;
    if (code >= 95) return <CloudLightning size={14} className="text-[#F27D26]" />;
    return <Cloud size={14} className="text-[#F27D26]" />;
  };

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
      <CookieConsent t={t} />
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

        {/* Top bar / Logo area */}
        <div className="relative w-full px-8 py-8 md:py-12 z-20 max-w-7xl mx-auto flex justify-between items-center border-b border-white/5">
             <div className="flex flex-col translate-y-2">
               <div className="text-[10px] tracking-[0.4em] font-bold uppercase text-[#F27D26]">Tenerife</div>
               <div className="text-[10px] tracking-[0.4em] font-bold uppercase text-white/40">South Guide</div>
             </div>
             
             <div className="flex items-center gap-4 md:gap-8">
                <div className="hidden md:block relative">
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

        {/* Hero Title Area - Scrolls away */}
        <header className="relative w-full px-8 pt-12 pb-16 z-10 max-w-7xl mx-auto overflow-hidden">
          <div className="relative leading-none mb-8">
            <h1 className="text-[70px] sm:text-[120px] md:text-[180px] lg:text-[240px] font-black uppercase tracking-tighter leading-[0.8] mix-blend-lighten text-white">
              TENER<br/>IFE
            </h1>
            <span className="absolute top-1/2 left-[30%] sm:left-[40%] md:left-[50%] lg:left-[580px] -translate-y-1/2 text-[50px] sm:text-[100px] md:text-[140px] lg:text-[180px] font-thin italic text-[#F27D26] opacity-90 leading-none pointer-events-none">
              {t.south}
            </span>
          </div>
          
          <p className="text-xs md:text-[11px] text-white/40 max-w-md uppercase tracking-[0.2em] font-medium leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-8 border-l border-[#F27D26]/30 pl-8 py-3">
            <div className="flex flex-col">
              <span className="text-[9px] tracking-[0.3em] text-[#F27D26] uppercase font-black mb-2">{t.localTime}</span>
              <span className="text-2xl font-light text-white tracking-tight">
                {currentTime.toLocaleTimeString('en-GB', { 
                  timeZone: 'Atlantic/Canary', 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            {weather && (
              <div className="flex items-center gap-5 sm:border-l sm:border-white/10 sm:pl-8">
                <div className="flex flex-col">
                  <span className="text-[9px] tracking-[0.3em] text-[#F27D26] uppercase font-black mb-2">{t.conditions}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-light text-white tracking-tight">{weather.temp}°C</span>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest">TFS South</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#F27D26]/5 flex items-center justify-center border border-[#F27D26]/10 shadow-lg shadow-[#F27D26]/5">
                  {getWeatherIcon(weather.code)}
                </div>
              </div>
            )}
          </div>
        </header>

         {/* Unified Navigation Bar - Sticky */}
        <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-y border-white/10">
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center h-16">
            {/* Desktop Navigation */}
            <div className="flex items-center gap-4 h-full md:flex-1 min-w-0">
               {/* Mobile Menu Trigger */}
               <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden w-10 h-10 -ml-2 flex items-center justify-center text-white/70 hover:text-white active:scale-90 transition-all"
               >
                 <Menu size={24} />
               </button>

               <nav className="hidden md:flex gap-5 lg:gap-8 items-center h-full overflow-x-auto hide-scrollbar">
                 {categories.map((category) => {
                   const Icon = category.icon;
                   const isActive = activeTab === category.id;
                   const label = t[category.id as keyof typeof t] || category.label;
                   
                   return (
                     <button
                       key={category.id}
                       onClick={() => handleTabChange(category.id)}
                       className={`h-full flex-shrink-0 flex items-center gap-2 text-[10px] tracking-widest font-medium uppercase transition-all whitespace-nowrap border-b-2 ${
                         isActive 
                           ? 'text-white border-b-[#F27D26]' 
                           : 'text-white/50 hover:text-white border-b-transparent'
                       }`}
                     >
                       <Icon size={14} className={isActive ? 'text-[#F27D26]' : 'text-white/30'} />
                       {label}
                     </button>
                   );
                 })}
               </nav>
            </div>

            {/* Mobile Status - Visible only when sticky */}
            <div className="md:hidden flex flex-col items-end">
               <span className="text-[11px] tracking-[0.2em] font-black uppercase text-[#F27D26] leading-none">
                 {t[activeTab as keyof typeof t]}
               </span>
               <span className="text-[7px] tracking-widest text-white/30 uppercase mt-1">{t.section}</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="fixed inset-0 z-[60] md:hidden bg-[#0A0A0A] flex flex-col pt-12"
            >
              <div className="flex justify-between items-center px-8 mb-8 flex-shrink-0">
                <div className="flex flex-col">
                  <div className="text-[10px] tracking-[0.4em] font-bold uppercase text-[#F27D26]">Tenerife</div>
                  <div className="text-[10px] tracking-[0.4em] font-bold uppercase text-white/40">South Guide</div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="px-8 mb-8 flex-shrink-0">
                 <div className="relative">
                    <Menu size={18} className="text-white/20 absolute left-4 top-1/2 -translate-y-1/2 rotate-90" />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-12 text-sm uppercase tracking-[0.2em] text-white placeholder:text-white/20 focus:outline-none focus:border-[#F27D26]/50 rounded-sm"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                      >
                        <X size={18} />
                      </button>
                    )}
                 </div>
              </div>

              <nav className="flex flex-col px-8 gap-6 overflow-y-auto flex-grow pb-8">
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
                      className="flex items-center justify-between group"
                    >
                      <div className={`flex items-center gap-6 text-2xl font-light tracking-tight transition-all ${
                        isActive ? 'text-[#F27D26]' : 'text-white/40'
                      }`}>
                        <Icon size={24} strokeWidth={1} />
                        {label}
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 bg-[#F27D26] rounded-full" />}
                    </motion.button>
                  );
                })}
              </nav>

              <div className="mt-auto p-8 flex-shrink-0 bg-white/[0.02] border-t border-white/5">
                <div className="flex flex-col gap-4 mb-8">
                  <span className="text-[10px] tracking-widest text-white/30 uppercase">{t.language}</span>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className={`text-[12px] font-bold tracking-[0.2em] uppercase px-3 py-2 border transition-all ${
                          lang === l.code 
                            ? 'text-black bg-[#F27D26] border-[#F27D26]' 
                            : 'text-white/30 border-white/10 active:border-white/30 hover:border-white/40'
                        }`}
                      >
                        {l.code}
                      </button>
                    ))}
                  </div>
                </div>
                
                {weather && (
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] tracking-widest text-white/30 uppercase mb-2">{t.localWeather}</span>
                      <span className="text-xl font-light text-white leading-none tracking-tight">{weather.temp}°C / Airport TFS</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#F27D26]/10 flex items-center justify-center border border-[#F27D26]/20">
                      {getWeatherIcon(weather.code)}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-8 py-16 min-h-[50vh] w-full z-10 relative">
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
              {activeTab === 'beaches' && <BeachesSection onSelect={setSelectedItem} t={t} searchQuery={searchQuery} favorites={favorites} onToggleFavorite={toggleFavorite} lang={lang} />}
              {activeTab === 'naturalPools' && <NaturalPoolsSection onSelect={setSelectedItem} t={t} searchQuery={searchQuery} />}
              {activeTab === 'localEats' && <LocalEatsSection onSelect={setSelectedItem} t={t} searchQuery={searchQuery} />}
              {activeTab === 'party' && <PartySection onSelect={setSelectedItem} t={t} searchQuery={searchQuery} />}
              {activeTab === 'activities' && <ActivitiesSection onSelect={setSelectedItem} t={t} searchQuery={searchQuery} />}
              {activeTab === 'agenda' && <AgendaSection onSelect={setSelectedItem} t={t} searchQuery={searchQuery} lang={lang} />}
              {activeTab === 'practical' && <PracticalSection t={t} weather={weather} />}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Footer */}
        <footer className="p-8 flex justify-between items-end border-t border-white/5 z-10 relative bg-[#0A0A0A]">
          <div className="flex flex-col gap-4 md:flex-row md:gap-16">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase opacity-30 mb-1 tracking-widest text-[#F27D26]">{t.elevation}</span>
              <span className="text-xs font-mono text-white/60">{t.teideHeight}</span>
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
              <span className="text-xs font-mono text-white/60">{t.reinaSofiaAirport}</span>
            </div>
          </div>
          <div className="text-[9px] tracking-[0.5em] text-white/30 uppercase hidden md:block">
            {t.islandsCanarySpain}
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
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </AnimatePresence>

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

        {/* Abades Floating Ad */}
        <AnimatePresence>
          {showAbadesAd && (
            <AbadesAdBanner t={t} onClose={() => setShowAbadesAd(false)} />
          )}
        </AnimatePresence>
      </div>
    </APIProvider>
  );
}

function AbadesAdBanner({ t, onClose }: { t: any; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 50 }}
      className="fixed bottom-8 left-8 md:left-auto md:right-8 z-[200] max-w-sm w-[calc(100%-4rem)] md:w-full bg-[#0A0A0A] border border-[#F27D26]/30 shadow-2xl overflow-hidden"
    >
      <div className="relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors z-10"
        >
          <X size={16} />
        </button>
        <img 
          src={abadesTerraceJpg} 
          alt="Abades Ocean Deck House"
          className="w-full h-44 object-cover"
        />
        <div className="p-6">
           <div className="text-[10px] tracking-[0.3em] font-black text-[#F27D26] uppercase mb-2">{t.featuredProperty}</div>
           <h4 className="text-xl font-light text-white mb-2">{t.abadesAdTitle}</h4>
           <p className="text-sm text-white/50 font-light mb-6 leading-relaxed">
             {t.abadesAdText}
           </p>
           <a 
             href="https://abades-ocean-deck-house.vercel.app/en" 
             target="_blank" 
             rel="noreferrer"
             className="inline-flex items-center gap-2 bg-[#F27D26] text-black px-6 py-2.5 text-[11px] uppercase tracking-widest font-black hover:bg-[#ff8c3a] transition-colors w-full justify-center"
           >
             {t.abadesAdButton}
             <ExternalLink size={14} />
           </a>
        </div>
      </div>
    </motion.div>
  );
}

function ItemDetailModal({ item, onClose, lang, t, favorites, onToggleFavorite }: { item: any; onClose: () => void; lang: Language; t: any; favorites: string[]; onToggleFavorite: (name: string) => void }) {
  const [translatedContent, setTranslatedContent] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [localWeather, setLocalWeather] = useState<{temp: number, code: number} | null>(null);

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
        schedule: item.schedule,
        specialty: item.specialty,
        priceLevel: item.priceLevel
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

  // Fetch local weather
  useEffect(() => {
    if (item.lat && item.lng) {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${item.lat}&longitude=${item.lng}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
          if (data.current_weather) {
            setLocalWeather({
              temp: Math.round(data.current_weather.temperature),
              code: data.current_weather.weathercode
            });
          }
        })
        .catch(err => console.error("Local weather fetch failed", err));
    }
  }, [item.lat, item.lng]);

  const [isFullScreenImageOpen, setIsFullScreenImageOpen] = useState(false);
  const display = translatedContent || item;

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun size={18} className="text-[#F27D26]" />;
    if (code >= 1 && code <= 3) return <CloudSun size={18} className="text-[#F27D26]" />;
    if (code >= 51 && code <= 67) return <CloudRain size={18} className="text-[#F27D26]" />;
    if (code >= 80 && code <= 82) return <CloudRain size={18} className="text-[#F27D26]" />;
    if (code >= 95) return <CloudLightning size={18} className="text-[#F27D26]" />;
    return <Cloud size={18} className="text-[#F27D26]" />;
  };

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
          className="relative z-10 w-full md:w-1/2 h-full bg-[#0A0A0A] border-l border-white/10 flex flex-col overflow-y-auto"
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
              src={
                item.name === 'Los Cristianos' ? losCristianosGif : 
                item.name === 'Costa Adeje' ? costAdejeGif : 
                item.name === 'Abades' ? abadesGif : 
                item.name === 'Playa de las Américas' ? americasGif : 
                item.name === 'El Médano' ? medanoGif : 
                item.name === 'Puerto de Santiago' ? puertoSantiagoGif : 
                item.name === 'Masca' ? mascaGif : 
                item.name === 'Alcalá' ? alcalaGif : 
                item.image
              } 
              alt={item.name} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-60" />
            
            <div className="absolute top-6 left-6 flex items-center gap-3">
              {beaches.some(b => b.name === item.name) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.name);
                  }}
                  className="w-10 h-10 bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors rounded-full"
                >
                  <Heart 
                    size={18} 
                    className={favorites.includes(item.name) ? 'fill-[#F27D26] text-[#F27D26]' : ''} 
                  />
                </button>
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
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
                {isTranslating ? "..." : `${t.aiTranslateTo}${lang}`}
              </button>
            )}
          </div>
          
          <h2 className="text-4xl text-white font-light tracking-tight mb-6">{item.name}</h2>

          <div className="flex flex-wrap gap-4 mb-8">
            {localWeather && (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-sm flex-1 min-w-[140px]">
                <div className="w-10 h-10 rounded-full bg-[#F27D26]/10 flex items-center justify-center border border-[#F27D26]/20">
                  {getWeatherIcon(localWeather.code)}
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block leading-none mb-1">{t.currentConditions}</span>
                  <span className="text-lg font-light text-white tracking-tight">{localWeather.temp}°C</span>
                </div>
              </div>
            )}
            
            {item.date && (
              <div className="flex items-center gap-3 bg-[#F27D26]/10 border border-[#F27D26]/20 px-4 py-3 rounded-sm flex-1 min-w-[200px]">
                <Calendar size={18} className="text-[#F27D26]" />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block leading-none mb-1">{t.eventDate}</span>
                  <span className="text-sm text-white font-medium">{item.date}</span>
                </div>
              </div>
            )}
          </div>

          <p className="text-white/80 font-light leading-relaxed mb-10 text-lg">
            {display.detailedDescription}
          </p>

          <div className="space-y-12">
            {item.specialty && (
              <div className="border-t border-white/10 pt-8">
                <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4">{t.specialty}</span>
                <div className="text-xl text-white font-light italic">
                  "{display.specialty || item.specialty}"
                </div>
              </div>
            )}

            {item.priceLevel && (
              <div className="border-t border-white/10 pt-8">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-4">{t.priceLevel}</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <span key={i} className={`text-xl ${i <= item.priceLevel.length ? 'text-[#F27D26]' : 'text-white/10'}`}>$</span>
                  ))}
                </div>
              </div>
            )}

            {item.rating && (
              <div className="border-t border-white/10 pt-8">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-4">{t.rating}</span>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star 
                        key={i} 
                        size={20} 
                        className={`${i <= Math.round(item.rating) ? 'fill-[#F27D26] text-[#F27D26]' : 'text-white/10'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-2xl text-white font-mono">{item.rating}</span>
                </div>
              </div>
            )}

            {display.schedule && (
              <div className="border-t border-white/10 pt-8">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-6 flex items-center gap-2">
                  <Clock size={12} /> {t.dailyProgram}
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

            {/* Beach Amenities Section */}
            {item.amenities && (
              <div className="border-t border-white/10 pt-8">
                <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-6">
                  {t.amenities}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/5 border border-white/10 rounded-sm">
                      <Sun size={14} className="text-[#F27D26]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">{t.sunLoungers}</span>
                      <p className="text-sm text-white/80 font-light">{item.amenities.sunLoungers}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/5 border border-white/10 rounded-sm">
                      <Umbrella size={14} className="text-[#F27D26]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">{t.umbrellas}</span>
                      <p className="text-sm text-white/80 font-light">{item.amenities.umbrellas}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/5 border border-white/10 rounded-sm">
                      <ShowerHead size={14} className="text-[#F27D26]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">{t.showers}</span>
                      <p className="text-sm text-white/80 font-light">{item.amenities.showers}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/5 border border-white/10 rounded-sm">
                      <ParkingCircle size={14} className="text-[#F27D26]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">{t.parking}</span>
                      <p className="text-sm text-white/80 font-light">{item.amenities.parking}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="p-2 bg-white/5 border border-white/10 rounded-sm">
                      <Accessibility size={14} className="text-[#F27D26]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">{t.accessibility}</span>
                      <div className="flex flex-wrap gap-2">
                        {item.amenities.accessibility.map((feature: string, idx: number) => (
                          <span key={idx} className="text-[11px] font-mono text-[#F27D26] bg-[#F27D26]/5 border border-[#F27D26]/10 px-2 py-0.5 rounded-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                
                {item.address && (
                  <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-sm">
                    <span className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">{t.exactAddress}</span>
                    <p className="text-sm text-white/80 font-light">{item.address}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-between items-center text-xs text-white/40 font-mono">
                  <span>{item.lat.toFixed(4)}° N, {Math.abs(item.lng).toFixed(4)}° W</span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-[#F27D26] transition-colors"
                  >
                    {t.openInGoogleMaps} <ExternalLink size={12} />
                  </a>
                </div>

                {(item.website || item.officialLink) && (
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <a 
                      href={item.website || item.officialLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 transition-colors rounded-sm w-full justify-center"
                    >
                      {t.visitOfficialWebsite} <ExternalLink size={14} />
                    </a>
                  </div>
                )}
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
            src={
              item.name === 'Los Cristianos' ? losCristianosGif : 
              item.name === 'Costa Adeje' ? costAdejeGif : 
              item.name === 'Abades' ? abadesGif : 
              item.name === 'Playa de las Américas' ? americasGif : 
              item.name === 'El Médano' ? medanoGif : 
              item.name === 'Puerto de Santiago' ? puertoSantiagoGif : 
              item.name === 'Masca' ? mascaGif : 
              item.name === 'Alcalá' ? alcalaGif : 
              item.image
            }
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
            <p className="text-2xl font-light text-white leading-tight">{t.sepNov}</p>
            <span className="text-[11px] text-white/40 mt-1 uppercase tracking-tighter italic">{t.bestTimeSub}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold flex items-center gap-2"><MapPin size={12}/> {t.vibe}</span>
            <p className="text-2xl font-light text-white leading-tight">{t.sunnyVaried}</p>
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
            alt={t.iconicAbades} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80 group-hover/canvas:opacity-100 group-hover/canvas:scale-105 transition-all duration-1000"
          />
          <div className="absolute top-4 left-4 bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/10 px-3 py-1 text-[9px] uppercase tracking-widest text-white/70">
            Abades
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
  const [activeFilter, setActiveFilter] = useState(t.all);
  const filters = [t.all, t.luxury, t.party, t.traditional, t.bohemian];

  const filteredDestinations = destinationsList.filter(dest => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = dest.name.toLowerCase().includes(searchStr) || 
                         dest.description.toLowerCase().includes(searchStr) ||
                         dest.detailedDescription.toLowerCase().includes(searchStr) ||
                         dest.highlights.some(h => h.toLowerCase().includes(searchStr));
    
    const vibeLabel = dest.name === 'Costa Adeje' ? t.luxury :
                      dest.name === 'Playa de las Américas' ? t.party :
                      dest.name === 'Abades' ? t.bohemian :
                      dest.name === 'Alcalá' ? t.traditional :
                      dest.name === 'Puerto de Santiago' ? t.traditional :
                      dest.name === 'Masca' ? t.traditional :
                      dest.name === 'Los Cristianos' ? t.traditional :
                      dest.name === 'El Médano' ? t.bohemian : t.all;

    const matchesFilter = activeFilter === t.all || vibeLabel === activeFilter;
    
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
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-white/10 pt-12">
        <AnimatePresence mode="popLayout">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((dest, idx) => {
              // Map to localized description if available
              let description = dest.description;
              if (dest.name === 'Costa Adeje') description = t.adejeDesc;
              if (dest.name === 'Abades') description = t.abadesDesc;
              if (dest.name === 'Playa de las Américas') description = t.americasDesc;
              if (dest.name === 'Alcalá') description = t.alcalaDesc;
              if (dest.name === 'Puerto de Santiago') description = t.puertoSantiagoDesc;
              if (dest.name === 'Masca') description = t.mascaDesc;
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
                  <div className="h-[300px] overflow-hidden border border-white/10 relative group-hover:border-[#F27D26]/50 transition-all duration-500 shadow-2xl shadow-transparent group-hover:shadow-[#F27D26]/20">
                    <img 
                      src={
                        dest.name === 'Los Cristianos' ? losCristianosGif : 
                        dest.name === 'Costa Adeje' ? costAdejeGif : 
                        dest.name === 'Abades' ? abadesGif : 
                        dest.name === 'Playa de las Américas' ? americasGif : 
                        dest.name === 'El Médano' ? medanoGif : 
                        dest.name === 'Puerto de Santiago' ? puertoSantiagoGif : 
                        dest.name === 'Masca' ? mascaGif : 
                        dest.name === 'Alcalá' ? alcalaGif : 
                        dest.image
                      } 
                      alt={`Aerial view of ${dest.name}, Tenerife South`} 
                      referrerPolicy="no-referrer" 
                      className={`w-full h-full object-cover transition-all duration-1000 ${
                        (dest.name === 'Los Cristianos' || dest.name === 'Costa Adeje' || dest.name === 'Abades' || dest.name === 'Playa de las Américas' || dest.name === 'El Médano' || dest.name === 'Puerto de Santiago' || dest.name === 'Masca' || dest.name === 'Alcalá')
                          ? 'opacity-40 grayscale blur-[4px] group-hover:opacity-100 group-hover:grayscale-0 group-hover:blur-0 group-hover:scale-[1.03]' 
                          : 'opacity-90 group-hover:opacity-100 group-hover:scale-[1.05]'
                      }`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                    {(dest.name === 'Los Cristianos' || dest.name === 'Costa Adeje' || dest.name === 'Abades' || dest.name === 'Playa de las Américas' || dest.name === 'El Médano' || dest.name === 'Puerto de Santiago' || dest.name === 'Masca' || dest.name === 'Alcalá') && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="bg-black/60 backdrop-blur-md border border-white/20 p-3 rounded-full opacity-100 group-hover:opacity-0 transition-all duration-300">
                           <Sparkles size={20} className="text-[#F27D26] animate-pulse" />
                         </div>
                      </div>
                    )}
                    <div className="absolute bottom-6 right-6 bg-[#F27D26] text-black text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      {t.explore}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-light text-white mb-2 group-hover:text-[#F27D26] transition-colors">{dest.name}</h3>
                    <p className="text-white/60 font-light text-sm mb-6 leading-relaxed line-clamp-2">{description}</p>
                    
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold">{t.highlights}</span>
                      <div className="flex flex-col gap-1 mt-2">
                        {dest.highlights.map((highlight, hIdx) => {
                          let hDisplay = highlight;
                          if (highlight === 'Playa del Duque') hDisplay = 'Playa del Duque';
                          if (highlight === 'Siam Park') hDisplay = 'Siam Park';
                          if (highlight === 'High-end shopping') hDisplay = t.luxury;
                          if (highlight === 'Sanatorio de Abades (Ruins)') hDisplay = t.traditional;
                          if (highlight === 'Los Abrisquitos beach') hDisplay = 'Playa Los Abrisquitos';
                          if (highlight === 'Excellent diving sites') hDisplay = t.natureCulture || t.traditional;
                          if (highlight === 'Veronicas Strip') hDisplay = 'Veronicas Strip';
                          if (highlight === 'Surfing spots') hDisplay = t.sports || t.adventure;
                          if (highlight === 'Endless bars and clubs') hDisplay = t.party;
                          if (highlight === 'Natural Rock Pools') hDisplay = t.natural || t.traditional;
                          if (highlight === 'Playa de Alcalá') hDisplay = 'Playa de Alcalá';
                          if (highlight === 'Luxury promenade') hDisplay = t.luxury;
                          if (highlight === 'Coastal Path') hDisplay = t.traditional;
                          if (highlight === 'Stunning cliff views') hDisplay = t.natureCulture || t.traditional;
                          if (highlight === 'Masca Ravine') hDisplay = t.natureCulture || t.traditional;
                          if (highlight === 'Traditional stone architecture') hDisplay = t.traditional;
                          if (highlight === 'Spectacular mountain views') hDisplay = t.natureCulture || t.traditional;
                          if (highlight === 'Ferry port to La Gomera') hDisplay = t.traditional;
                          if (highlight === 'Las Vistas beach') hDisplay = 'Playa de las Vistas';
                          if (highlight === 'Seafood restaurants') hDisplay = t.traditional;
                          if (highlight === 'Kitesurfing') hDisplay = t.sports || t.adventure;
                          if (highlight === 'Montaña Roja') hDisplay = 'Montaña Roja';
                          if (highlight === 'Bohemian cafes') hDisplay = t.bohemian;

                          return (
                            <span key={hIdx} className="text-[11px] text-white/40 uppercase tracking-widest font-mono">
                              {hDisplay}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.section>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10">
              <p className="text-white/40 font-light italic">{t.noDestinationsFound}</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

function BeachesSection({ onSelect, t, searchQuery, favorites, onToggleFavorite, lang }: { onSelect: (item: any) => void; t: any; searchQuery: string; favorites: string[]; onToggleFavorite: (name: string) => void; lang: Language }) {
  const [activeFilter, setActiveFilter] = useState(t.all);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const filters = [t.all, t.top10, t.goldenSand, t.darkSand, t.natural];

  const filteredBeaches = beaches.filter(beach => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = beach.name.toLowerCase().includes(searchStr) || 
                          beach.description.toLowerCase().includes(searchStr) ||
                          beach.detailedDescription.toLowerCase().includes(searchStr) ||
                          beach.location.toLowerCase().includes(searchStr) ||
                          beach.type.toLowerCase().includes(searchStr);
    
    // Technical mapping to data internal types
    const internalFilter = activeFilter === t.goldenSand ? 'Golden Sand' :
                          activeFilter === t.darkSand ? 'Dark Sand' :
                          activeFilter === t.natural ? 'Natural' : 
                          activeFilter === t.top10 ? 'Top10' : 'All';

    const matchesFilter = internalFilter === 'All' || internalFilter === 'Top10' || beach.type.includes(internalFilter);
    const matchesFavorites = !showOnlyFavorites || favorites.includes(beach.name);
    
    return matchesSearch && matchesFilter && matchesFavorites;
  });

  const displayBeaches = activeFilter === t.top10 
    ? [...filteredBeaches].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10)
    : filteredBeaches;

  return (
    <article>
      <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4">{t.beaches}</span>
          <h2 className="text-4xl text-white font-light leading-tight max-w-xl">{t.beachesTitle}</h2>
        </div>

        <div className="flex flex-col items-end gap-6">
          <div className="flex flex-wrap gap-2 justify-end">
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
          
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`flex items-center gap-2 px-4 py-1.5 text-[9px] uppercase tracking-widest transition-all border ${
              showOnlyFavorites 
                ? 'bg-[#F27D26]/10 border-[#F27D26] text-[#F27D26]' 
                : 'border-white/10 text-white/40 hover:border-white/30'
            }`}
          >
            <Heart size={12} className={showOnlyFavorites ? 'fill-[#F27D26]' : ''} />
            {t.favoritesOnly}
          </button>
        </div>
      </header>
      
      <div className="grid gap-12 border-t border-white/10 pt-12">
        <AnimatePresence mode="popLayout">
          {displayBeaches.length > 0 ? (
            displayBeaches.map((beach, idx) => {
              const isFavorite = favorites.includes(beach.name);
              
              return (
                <motion.section 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={beach.name} 
                  className="flex flex-col md:flex-row md:items-start gap-8 group cursor-pointer relative"
                  onClick={() => onSelect(beach)}
                >
                  <div className="flex-shrink-0 text-white/20 group-hover:text-[#F27D26] transition-colors duration-500 hidden md:block">
                    <span className="text-5xl font-black">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 border-b border-white/10 pb-4 group-hover:border-[#F27D26]/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <h3 className="text-3xl font-light text-white tracking-tight group-hover:text-[#F27D26] transition-colors">{beach.name}</h3>
                        {beach.rating && (
                          <div className="flex items-center gap-1 bg-[#F27D26]/10 px-2 py-0.5 rounded-sm border border-[#F27D26]/50">
                            <Star size={10} className="fill-[#F27D26] text-[#F27D26]" />
                            <span className="text-[10px] font-mono font-bold text-[#F27D26]">{beach.rating}</span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(beach.name);
                          }}
                          className="p-2 transition-transform active:scale-125 md:opacity-0 group-hover:opacity-100"
                        >
                          <Heart 
                            size={20} 
                            className={`transition-colors ${isFavorite ? 'fill-[#F27D26] text-[#F27D26]' : 'text-white/20 hover:text-white'}`} 
                          />
                        </button>
                      </div>
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
              );
            })
          ) : (
            <div className="py-20 text-center border border-dashed border-white/10">
              <p className="text-white/40 font-light italic">
                {showOnlyFavorites ? t.noFavoritesYet : t.noBeachesFound}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

function LocalEatsSection({ onSelect, t, searchQuery }: { onSelect: (item: Restaurant) => void; t: any; searchQuery: string }) {
  const filteredEats = localEats.filter(eat => {
    const searchStr = searchQuery.toLowerCase();
    return eat.name.toLowerCase().includes(searchStr) || 
           eat.location.toLowerCase().includes(searchStr) ||
           eat.description.toLowerCase().includes(searchStr) ||
           eat.specialty.toLowerCase().includes(searchStr);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredEats.map((eat, i) => (
        <motion.div
          key={eat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelect(eat)}
          className="group cursor-pointer"
        >
          <div className="aspect-[16/10] overflow-hidden bg-white/5 mb-4 border border-white/5 relative">
            <img 
              src={eat.image} 
              alt={eat.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-sm border border-white/10">
              <Star size={10} className="fill-[#F27D26] text-[#F27D26]" />
              <span className="text-[10px] font-bold text-white">{eat.rating}</span>
            </div>
            <div className="absolute top-4 right-4 flex gap-1">
              {eat.priceLevel.split('').map((s, idx) => (
                <span key={idx} className="text-[#F27D26] text-xs font-bold leading-none bg-black/50 backdrop-blur-md p-1 rounded-sm border border-[#F27D26]/20">{s}</span>
              ))}
            </div>
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 text-[8px] uppercase tracking-[0.2em] text-white/50">
              {eat.type}
            </div>
          </div>
          <h3 className="text-xl text-white font-light tracking-tight group-hover:text-[#F27D26] transition-colors mb-2">{eat.name}</h3>
          <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest mb-3">
            <MapPin size={10} className="text-[#F27D26]" />
            {eat.location}
          </div>
          <p className="text-sm text-white/60 font-light line-clamp-2 leading-relaxed italic">
            "{eat.specialty}"
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function PartySection({ onSelect, t, searchQuery }: { onSelect: (item: any) => void; t: any; searchQuery: string }) {
  const [activeFilter, setActiveFilter] = useState(t.all);
  const filters = [t.all, t.clubs, t.liveMusic, t.pubs, t.festivals, t.underground, t.latin];

  const filteredClubs = nightlifeClubs.filter(club => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = club.name.toLowerCase().includes(searchStr) || 
                          club.description.toLowerCase().includes(searchStr) ||
                          club.location.toLowerCase().includes(searchStr);
    
    if (activeFilter === t.all) return matchesSearch;
    if (activeFilter === t.clubs && (club.type.toLowerCase().includes('club'))) return matchesSearch;
    if (activeFilter === t.liveMusic && (club.type.toLowerCase().includes('live music') || club.type.toLowerCase().includes('venue'))) return matchesSearch;
    if (activeFilter === t.pubs && (club.type.toLowerCase().includes('pub') || club.type.toLowerCase().includes('bar'))) return matchesSearch;
    if (activeFilter === t.underground && club.musicType.some(m => m === 'Techno' || m === 'Deep House' || m === 'Rock' || m === 'Blues' || m === 'Alternative')) return matchesSearch;
    if (activeFilter === t.latin && (club.musicType.includes('Reggaeton') || club.musicType.includes('Salsa') || club.musicType.includes('Bachata'))) return matchesSearch;
    return false;
  });

  const partyEvents = culturalEvents.filter(event => {
    const isParty = event.type.toLowerCase().includes('party') || 
                    event.type.toLowerCase().includes('festival') ||
                    event.type.toLowerCase().includes('electronic');
    
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = event.name.toLowerCase().includes(searchStr) || 
                          event.location.toLowerCase().includes(searchStr);

    if (activeFilter === t.all) return isParty && matchesSearch;
    if (activeFilter === t.festivals && event.type.toLowerCase().includes('festival')) return isParty && matchesSearch;
    if (activeFilter === t.underground && event.type.toLowerCase().includes('electronic')) return isParty && matchesSearch;
    return false;
  });

  return (
    <article>
      <header className="mb-12">
        <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4">{t.party}</span>
        <h2 className="text-4xl text-white font-light leading-tight max-w-xl mb-8">{t.partyTitle}</h2>
        
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-[9px] uppercase tracking-widest transition-all border ${
                activeFilter === filter 
                  ? 'bg-[#F27D26] text-black font-bold border-[#F27D26]' 
                  : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-16">
        {/* Clubs & Venues Grid */}
        {(activeFilter === t.all || activeFilter === t.clubs || activeFilter === t.underground || activeFilter === t.latin || activeFilter === t.liveMusic || activeFilter === t.pubs) && filteredClubs.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
               <div className="h-[1px] flex-grow bg-white/10"></div>
               <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">
                 {activeFilter === t.liveMusic ? 'Live Music Stages' : activeFilter === t.pubs ? 'Authentic Pubs' : 'Top Venues'}
               </h3>
               <div className="h-[1px] flex-grow bg-white/10"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClubs.map((club, idx) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onSelect(club)}
                  className="group cursor-pointer bg-white/[0.02] border border-white/5 hover:border-[#F27D26]/30 transition-all overflow-hidden flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={club.image} 
                      alt={club.name} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                    />
                    <div className="absolute top-4 left-4 flex gap-1">
                      {club.musicType.slice(0, 2).map(m => (
                        <span key={m} className="bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[8px] uppercase tracking-widest text-[#F27D26]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-xl font-light text-white group-hover:text-[#F27D26] transition-colors">{club.name}</h4>
                       <div className="flex items-center gap-1 text-[#F27D26] font-mono text-xs">
                         <Star size={10} className="fill-[#F27D26]" />
                         {club.rating}
                       </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-[9px] uppercase tracking-widest mb-4">
                      <MapPin size={10} />
                      {club.location}
                    </div>
                    <p className="text-sm text-white/60 font-light leading-relaxed line-clamp-2 mb-6">
                      {club.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[9px] tracking-widest uppercase text-white/30 font-bold">
                       <span>{club.type}</span>
                       <span className="group-hover:text-[#F27D26] transition-colors">Details +</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 2026 Parties / Festivals */}
        {(activeFilter === 'All' || activeFilter === 'Festivals' || activeFilter === 'Underground') && partyEvents.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
               <div className="h-[1px] flex-grow bg-[#F27D26]/20"></div>
               <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#F27D26] font-black">2026 Party Calendar</h3>
               <div className="h-[1px] flex-grow bg-[#F27D26]/20"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {partyEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => onSelect(event)}
                  className="flex bg-white/5 border border-white/10 hover:border-[#F27D26]/50 transition-all cursor-pointer overflow-hidden group"
                >
                  <div className="w-1/3 aspect-square overflow-hidden relative border-r border-white/10">
                    <img 
                      src={event.image} 
                      alt={event.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                       <Calendar size={14} className="text-[#F27D26] mb-1" />
                       <span className="text-[10px] text-white font-bold uppercase tracking-widest">{event.date}</span>
                    </div>
                  </div>
                  <div className="w-2/3 p-6 flex flex-col">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#F27D26] font-black mb-2">{event.type}</span>
                    <h4 className="text-xl font-light text-white mb-2 group-hover:text-[#F27D26] transition-colors">{event.name}</h4>
                    <p className="text-sm text-white/50 font-light mb-4 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                    <div className="mt-auto flex justify-between items-center text-[10px] tracking-widest uppercase text-white/40">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-[#F27D26]" />
                        {event.location}
                      </div>
                      <span className="font-mono text-[#F27D26]">{event.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {filteredClubs.length === 0 && partyEvents.length === 0 && (
          <div className="py-20 text-center border border-dashed border-white/10">
            <p className="text-white/40 font-light italic">{t.noClubsFound}</p>
          </div>
        )}
      </div>
    </article>
  );
}

function ActivitiesSection({ onSelect, t, searchQuery }: { onSelect: (item: any) => void; t: any; searchQuery: string }) {
  const [activeFilter, setActiveFilter] = useState(t.all);
  const filters = [t.all, t.nature, t.adventure, t.family, t.water];

  const filteredActivities = activities.filter(activity => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = activity.name.toLowerCase().includes(searchStr) || 
                          activity.description.toLowerCase().includes(searchStr) ||
                          activity.detailedDescription.toLowerCase().includes(searchStr);
    
    const typeLabel = activity.name === 'Whale & Dolphin Watching' ? t.water :
                      activity.name === 'Siam Park' ? t.family :
                      activity.name === 'Teide National Park' ? t.nature :
                      activity.name === 'Surfing in Las Américas' ? t.adventure : t.all;

    const matchesFilter = activeFilter === t.all || typeLabel === activeFilter;
    
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
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-white/10 pt-12">
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
              <p className="text-white/40 font-light italic">{t.noActivitiesFound}</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

function NaturalPoolsSection({ onSelect, t, searchQuery }: { onSelect: (item: any) => void; t: any; searchQuery: string }) {
  const filteredPools = naturalPools.filter(pool => {
    const searchStr = searchQuery.toLowerCase();
    return pool.name.toLowerCase().includes(searchStr) || 
           pool.description.toLowerCase().includes(searchStr) ||
           pool.detailedDescription.toLowerCase().includes(searchStr) ||
           pool.location.toLowerCase().includes(searchStr);
  });

  return (
    <article>
      <header className="mb-12">
        <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4">{t.naturalPools}</span>
        <h2 className="text-4xl text-white font-light leading-tight max-w-xl">{t.naturalPoolsTitle}</h2>
      </header>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-white/10 pt-12">
        <AnimatePresence mode="popLayout">
          {filteredPools.length > 0 ? (
            filteredPools.map((pool, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={pool.name}
                onClick={() => onSelect(pool)}
                className="group cursor-pointer flex flex-col h-full bg-white/[0.02] border border-white/5 hover:border-[#F27D26]/30 transition-all overflow-hidden"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={pool.image} 
                    alt={pool.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest text-[#F27D26] border border-[#F27D26]/30 flex items-center gap-2">
                    <Waves size={10} />
                    {t.natural}
                  </div>
                </div>
                <div className="p-6 space-y-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-light text-white group-hover:text-[#F27D26] transition-colors">{pool.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest">
                    <MapPin size={10} className="text-[#F27D26]" />
                    {pool.location}
                  </div>
                  <p className="text-white/60 font-light text-sm leading-relaxed line-clamp-3">
                    {pool.description}
                  </p>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-end mt-auto">
                    <span className="text-[10px] uppercase text-[#F27D26] border border-[#F27D26]/30 px-3 py-1 opacity-0 group-hover:opacity-100 transition-all">{t.viewInfo}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-sm">
              <p className="text-white/40 font-light italic">{t.noNaturalPoolsFound}</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

function PracticalSection({ t, weather }: { t: any; weather: any }) {
  const practicalData = [
    { icon: Plane, title: t.airportTitle, content: t.airportContent },
    { 
      icon: Sun, 
      title: t.weatherTitle, 
      content: weather 
        ? `${t.currentlyIts}${weather.temp}°C${t.atSouthAirport}`
        : t.weatherContent 
    },
    { icon: Bus, title: t.transportTitle, content: t.transportContent },
    { icon: Utensils, title: t.foodTitle, content: t.foodContent },
  ];

  return (
    <article>
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4">{t.practical}</span>
        <h2 className="text-4xl text-white font-light leading-tight max-w-xl">{t.practicalTitle}</h2>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-white/10 pt-12">
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

function AgendaSection({ onSelect, t, searchQuery, lang }: { onSelect: (item: any) => void; t: any; searchQuery: string; lang: Language }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4)); // Default to May 2026 for demo consistency
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeType, setActiveType] = useState(t.all);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  const types = [t.all, t.traditional, t.festival, t.sports, t.market];

  const filteredEvents = culturalEvents.filter(event => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = event.name.toLowerCase().includes(searchStr) || 
                          event.description.toLowerCase().includes(searchStr) ||
                          event.detailedDescription.toLowerCase().includes(searchStr) ||
                          event.location.toLowerCase().includes(searchStr) ||
                          event.type.toLowerCase().includes(searchStr);
    
    // Technical mapping to data internal types
    const typeMatch = activeType === t.all || 
                     (activeType === t.traditional && event.type === 'Traditional') ||
                     (activeType === t.festival && event.type === 'Festival') ||
                     (activeType === t.sports && event.type === 'Sports') ||
                     (activeType === t.market && event.type === 'Market');

    if (!event.dateStart) return false;
    const eventDate = parseISO(event.dateStart);
    let matchesDateValue = true;
    if (selectedDate) {
      matchesDateValue = isSameDay(eventDate, selectedDate);
    } else {
      matchesDateValue = isSameMonth(eventDate, currentMonth);
    }

    return matchesSearch && typeMatch && matchesDateValue;
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <article>
      <header className="mb-12">
        <span className="text-[10px] uppercase tracking-widest text-[#F27D26] font-bold block mb-4">{t.agenda}</span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-4xl text-white font-light leading-tight max-w-xl">{t.agendaTitle}</h2>
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setViewMode('list')}
                className={`text-[9px] uppercase tracking-widest px-4 py-2 border transition-all ${viewMode === 'list' ? 'bg-white text-black border-white font-bold' : 'text-white/40 border-white/10 hover:border-white/30'}`}
              >
                List View
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`text-[9px] uppercase tracking-widest px-4 py-2 border transition-all ${viewMode === 'map' ? 'bg-white text-black border-white font-bold' : 'text-white/40 border-white/10 hover:border-white/30'}`}
              >
                Map View
              </button>
            </div>
          </div>
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
              {selectedDate ? format(selectedDate, 'PPP', { locale: locales[lang] }) : format(currentMonth, 'MMMM yyyy', { locale: locales[lang] })}
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

          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div 
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid md:grid-cols-2 gap-8"
              >
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
              </motion.div>
            ) : (
              <motion.div 
                key="map"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-[600px] border border-white/10 bg-white/5 relative"
              >
                <EventsMap events={filteredEvents} onSelect={onSelect} />
                {filteredEvents.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <p className="text-white/40 font-light italic">No events to display on map.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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

function EventsMap({ events, onSelect }: { events: any[]; onSelect: (item: any) => void }) {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center h-full gap-2 border border-red-500/30 bg-red-500/10">
        <span className="text-red-400 font-bold mb-1">Google Maps Auth Error</span>
        <span className="text-sm font-light text-white/80">The Maps API could not load.</span>
      </div>
    );
  }

  // Calculate center of filtered events or default to South Tenerife
  const center = events.length > 0 
    ? { 
        lat: events.reduce((acc, curr) => acc + curr.lat, 0) / events.length,
        lng: events.reduce((acc, curr) => acc + curr.lng, 0) / events.length
      }
    : { lat: 28.05, lng: -16.7 };

  return (
    <Map
      defaultCenter={center}
      defaultZoom={11}
      mapId="EVENTS_MAP_ID"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      disableDefaultUI={true}
      style={{ width: '100%', height: '100%' }}
    >
      {events.map((event) => (
        <AdvancedMarker 
          key={event.id}
          position={{ lat: event.lat, lng: event.lng }} 
          title={event.name}
          onClick={() => onSelect(event)}
        >
          <Pin background="#F27D26" borderColor="#0A0A0A" glyphColor="#fff" scale={1} />
        </AdvancedMarker>
      ))}
    </Map>
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


