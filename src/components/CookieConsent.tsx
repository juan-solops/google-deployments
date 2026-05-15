import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, Shield, BarChart3, Target, Settings2, ChevronRight, Check } from 'lucide-react';
import { Translations } from '../i18n';

interface CookieConsentProps {
  t: Translations;
}

interface CookieSettings {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent({ t }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true, // Always true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
      // Disable scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      try {
        const savedSettings = JSON.parse(consent);
        if (savedSettings && typeof savedSettings === 'object') {
          setSettings(savedSettings);
        }
      } catch (e) {
        // Handle legacy or corrupted data
        localStorage.removeItem('cookie-consent');
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
      }
    }
  }, []);

  const saveConsent = (finalSettings: CookieSettings) => {
    localStorage.setItem('cookie-consent', JSON.stringify(finalSettings));
    setIsVisible(false);
    document.body.style.overflow = 'auto';
  };

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, analytics: true, marketing: true };
    setSettings(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected = { essential: true, analytics: false, marketing: false };
    setSettings(allRejected);
    saveConsent(allRejected);
  };

  const handleSaveSettings = () => {
    saveConsent(settings);
  };

  const toggleSetting = (key: keyof CookieSettings) => {
    if (key === 'essential') return;
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {!isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
          }}
          className="fixed bottom-6 left-6 z-[900] w-12 h-12 bg-white/5 hover:bg-[#F27D26]/20 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-[#F27D26] transition-all shadow-lg cursor-pointer group"
          title={t.cookieManageSettings}
        >
          <Cookie size={20} className="group-hover:rotate-12 transition-transform" />
        </motion.button>
      )}

      {isVisible && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop blurring the whole site */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 md:p-12 overflow-y-auto">
              {!showSettings ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#F27D26]/10 rounded-full flex items-center justify-center mb-6">
                    <Cookie className="text-[#F27D26]" size={32} />
                  </div>
                  <h2 className="text-3xl font-light text-white mb-4 tracking-tight">
                    {t.cookieConsentTitle}
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-md">
                    {t.cookieConsentDescription}
                  </p>

                  <div className="flex flex-col w-full gap-3">
                    <button
                      onClick={handleAcceptAll}
                      className="w-full bg-[#F27D26] hover:bg-[#ff8c3a] text-black font-black py-4 px-6 text-[11px] uppercase tracking-widest transition-all cursor-pointer"
                    >
                      {t.cookieAcceptAll}
                    </button>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <button
                        onClick={handleRejectAll}
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 px-6 text-[11px] uppercase tracking-widest transition-all cursor-pointer"
                      >
                        {t.cookieRejectAll}
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 px-6 text-[11px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Settings2 size={14} />
                        {t.cookieManageSettings}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-2">
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                    <h2 className="text-2xl font-light text-white tracking-tight">
                      {t.cookieManageSettings}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Essential */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4 opacity-80">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <Shield className="text-white/40" size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{t.cookieEssentialTitle}</h4>
                        <p className="text-xs text-white/40">{t.cookieEssentialDesc}</p>
                      </div>
                      <div className="w-10 h-6 bg-[#F27D26]/20 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-[#F27D26] rounded-full" />
                      </div>
                    </div>

                    {/* Analytics */}
                    <button
                      onClick={() => toggleSetting('analytics')}
                      className={`w-full text-left p-6 border rounded-2xl flex items-start gap-4 transition-all ${
                        settings.analytics 
                          ? 'bg-[#F27D26]/10 border-[#F27D26]/30' 
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${settings.analytics ? 'bg-[#F27D26]/20' : 'bg-white/10'}`}>
                        <BarChart3 className={settings.analytics ? 'text-[#F27D26]' : 'text-white/40'} size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{t.cookieAnalyticsTitle}</h4>
                        <p className="text-xs text-white/40">{t.cookieAnalyticsDesc}</p>
                      </div>
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.analytics ? 'bg-[#F27D26]/40' : 'bg-white/10'}`}>
                        <motion.div 
                          animate={{ x: settings.analytics ? 16 : 4 }}
                          className={`absolute top-1 w-4 h-4 rounded-full ${settings.analytics ? 'bg-[#F27D26]' : 'bg-white/20'}`} 
                        />
                      </div>
                    </button>

                    {/* Marketing */}
                    <button
                      onClick={() => toggleSetting('marketing')}
                      className={`w-full text-left p-6 border rounded-2xl flex items-start gap-4 transition-all ${
                        settings.marketing 
                          ? 'bg-[#F27D26]/10 border-[#F27D26]/30' 
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${settings.marketing ? 'bg-[#F27D26]/20' : 'bg-white/10'}`}>
                        <Target className={settings.marketing ? 'text-[#F27D26]' : 'text-white/40'} size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{t.cookieMarketingTitle}</h4>
                        <p className="text-xs text-white/40">{t.cookieMarketingDesc}</p>
                      </div>
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.marketing ? 'bg-[#F27D26]/40' : 'bg-white/10'}`}>
                        <motion.div 
                          animate={{ x: settings.marketing ? 16 : 4 }}
                          className={`absolute top-1 w-4 h-4 rounded-full ${settings.marketing ? 'bg-[#F27D26]' : 'bg-white/20'}`} 
                        />
                      </div>
                    </button>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="flex-1 text-white/40 hover:text-white text-[11px] uppercase tracking-widest transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black py-4 px-6 text-[11px] uppercase tracking-widest transition-all cursor-pointer border border-white/10"
                    >
                      {t.cookieSaveSettings}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer with legal small print */}
            <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-[10px] text-white/20 uppercase tracking-widest">
                GDPR COMPLIANT // TENERIFE SOUTH GUIDE
              </span>
              <div className="flex gap-4 text-[9px] uppercase tracking-widest text-white/40">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
