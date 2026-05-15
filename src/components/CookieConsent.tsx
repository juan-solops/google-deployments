import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';
import { Translations } from '../i18n';

interface CookieConsentProps {
  t: Translations;
}

export default function CookieConsent({ t }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-[999]"
        >
          <div className="bg-[#1A1A1A] border border-white/10 p-6 rounded-2xl shadow-2xl backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="bg-[#F27D26]/10 p-2 rounded-lg">
                <Cookie className="text-[#F27D26]" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium text-lg mb-1">{t.cookieConsentTitle}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {t.cookieConsentText}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 bg-[#F27D26] hover:bg-[#F27D26]/90 text-white font-medium py-2 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    {t.cookieAccept}
                  </button>
                  <button
                    onClick={handleDecline}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-2 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    {t.cookieDecline}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
