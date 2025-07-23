import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' }
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translate: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Basic translation map for demo purposes
const translations: Record<string, Record<string, string>> = {
  'en': {
    'welcome': 'Welcome',
    'crop_monitor': 'Crop Monitor',
    'disease_check': 'Disease Check',
    'market_price': 'Market Price',
    'gov_schemes': 'Gov Schemes',
    'weather_forecast': 'Weather Daily Forecast',
    'temperature': 'Temperature',
    'humidity': 'Humidity',
    'light_intensity': 'Light Intensity',
    'weather': 'Weather',
    'notifications': 'Notifications',
    'settings': 'Settings',
    'sign_out': 'Sign Out',
    'language': 'Language'
  },
  'kn': {
    'welcome': 'ನಮಸ್ಕಾರ',
    'crop_monitor': 'ಬೆಳೆ ಮೇಲ್ವಿಚಾರಣೆ',
    'disease_check': 'ರೋಗ ಪರೀಕ್ಷೆ',
    'market_price': 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ',
    'gov_schemes': 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    'weather_forecast': 'ಹವಾಮಾನ ಮುನ್ನೋಟ',
    'temperature': 'ತಾಪಮಾನ',
    'humidity': 'ಆರ್ದ್ರತೆ',
    'light_intensity': 'ಬೆಳಕಿನ ತೀವ್ರತೆ',
    'weather': 'ಹವಾಮಾನ',
    'notifications': 'ಸೂಚನೆಗಳು',
    'settings': 'ಸೆಟ್ಟಿಂಗ್ಗಳು',
    'sign_out': 'ಸೈನ್ ಔಟ್',
    'language': 'ಭಾಷೆ'
  },
  'hi': {
    'welcome': 'स्वागत',
    'crop_monitor': 'फसल मॉनिटर',
    'disease_check': 'रोग जांच',
    'market_price': 'बाजार मूल्य',
    'gov_schemes': 'सरकारी योजनाएं',
    'weather_forecast': 'मौसम पूर्वानुमान',
    'temperature': 'तापमान',
    'humidity': 'नमी',
    'light_intensity': 'प्रकाश तीव्रता',
    'weather': 'मौसम',
    'notifications': 'सूचनाएं',
    'settings': 'सेटिंग्स',
    'sign_out': 'साइन आउट',
    'language': 'भाषा'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      const language = languages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language.code);
  };

  const translate = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};