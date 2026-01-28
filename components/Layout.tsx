import React from 'react';
import { useLanguage } from '../LanguageContext';
import { InfoType } from './InfoModal';
import { useAuth } from '../AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  onOpenSaved?: () => void;
  onGoHome?: () => void;
  activeView?: 'home' | 'saved' | 'analysis';
  onShowInfo: (type: InfoType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onOpenSaved, onGoHome, activeView, onShowInfo }) => {
  const { t, language, setLanguage } = useLanguage();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-xl relative overflow-hidden flex flex-col">
      <header className="bg-emerald-600 text-white p-6 shadow-md rounded-b-3xl z-10">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onGoHome}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
          >
            <span className="text-3xl">🧊</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t.appTitle}</h1>
              <p className="text-xs text-emerald-100">{t.appSubtitle}</p>
            </div>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/20 transition-all uppercase tracking-wider flex items-center gap-2 shadow-sm"
              aria-label="Switch Language"
            >
              <span>{language === 'en' ? '🇺🇸 EN' : '🇮🇳 HI'}</span>
            </button>
          </div>
        </div>
        
        {/* User Stats / Logout Bar */}
        <div className="flex items-center justify-between bg-emerald-700/30 p-2 rounded-xl border border-emerald-500/30">
          <div className="flex items-center gap-2 px-2">
             <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold">
               {user?.username.charAt(0).toUpperCase()}
             </div>
             <span className="text-xs font-medium text-emerald-50">{t.welcomeBack} {user?.username}</span>
          </div>
          
          <div className="flex gap-1">
             <button 
                onClick={onOpenSaved}
                className={`p-2 rounded-lg transition-all ${
                  activeView === 'saved' 
                    ? 'bg-white text-emerald-600' 
                    : 'text-emerald-100 hover:bg-emerald-700/50'
                }`}
                title={t.saved}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={logout}
                className="p-2 text-emerald-100 hover:bg-emerald-700/50 rounded-lg transition-colors"
                title={t.logout}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {children}
      </main>
      <footer className="absolute bottom-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-10">
        <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest font-bold text-gray-400">
           <button onClick={() => onShowInfo('about')} className="hover:text-emerald-600 transition-colors">{t.footerAbout}</button>
           <button onClick={() => onShowInfo('privacy')} className="hover:text-emerald-600 transition-colors">{t.footerPrivacy}</button>
           <button onClick={() => onShowInfo('terms')} className="hover:text-emerald-600 transition-colors">{t.footerTerms}</button>
        </div>
        <div className="text-center mt-2 text-[9px] text-gray-300">
          Powered by Gemini Pro
        </div>
      </footer>
    </div>
  );
};