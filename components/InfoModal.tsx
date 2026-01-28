import React from 'react';
import { useLanguage } from '../LanguageContext';

export type InfoType = 'terms' | 'privacy' | 'about';

interface InfoModalProps {
  type: InfoType;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  const { t } = useLanguage();

  let title = '';
  let content = '';

  switch (type) {
    case 'terms':
      title = t.termsTitle;
      content = t.termsContent;
      break;
    case 'privacy':
      title = t.privacyTitle;
      content = t.privacyContent;
      break;
    case 'about':
      title = t.aboutTitle;
      content = t.aboutContent;
      break;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md max-h-[80vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-5 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 text-gray-700 leading-relaxed whitespace-pre-line text-sm">
          {content}
        </div>
        
        <div className="p-5 border-t bg-gray-50 rounded-b-3xl">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};