import React, { useRef, useState, useEffect } from 'react';
import { Preferences } from '../types';
import { useLanguage } from '../LanguageContext';

// Define SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface CameraUploadProps {
  onAnalyze: (image: string, prefs: Preferences) => void;
  isLoading: boolean;
  onVoiceInput: (text: string) => void;
}

export const CameraUpload: React.FC<CameraUploadProps> = ({ onAnalyze, isLoading, onVoiceInput }) => {
  const { t, language } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const [diet, setDiet] = useState<"Veg" | "Non-Veg">("Veg");
  const [time, setTime] = useState(30);
  const [servings, setServings] = useState(2);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStart = () => {
    if (preview) {
      onAnalyze(preview, { diet, timeAvailable: time, servings });
    }
  };

  const toggleListening = () => {
    if (isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onVoiceInput(text);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
        <h2 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center gap-2">
          🍳 {t.quickPrefs}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-700 uppercase">{t.diet}</label>
            <div className="flex bg-white rounded-lg p-1 border border-emerald-200">
              <button 
                onClick={() => setDiet("Veg")}
                className={`flex-1 py-1 text-sm rounded-md transition-all ${diet === 'Veg' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700'}`}
              >
                {t.veg}
              </button>
              <button 
                onClick={() => setDiet("Non-Veg")}
                className={`flex-1 py-1 text-sm rounded-md transition-all ${diet === 'Non-Veg' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700'}`}
              >
                {t.nonVeg}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-700 uppercase">{t.servings}</label>
            <input 
              type="number" 
              value={servings} 
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-full py-1.5 px-3 bg-white border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min="1"
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <label className="text-xs font-bold text-emerald-700 uppercase flex justify-between">
            <span>{t.time} ({t.minutes})</span>
            <span>{time}m</span>
          </label>
          <input 
            type="range" 
            min="10" 
            max="120" 
            step="5" 
            value={time} 
            onChange={(e) => setTime(Number(e.target.value))}
            className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>
      </div>

      <div className="relative group">
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          onChange={handleFileChange} 
          className="hidden" 
          ref={fileInputRef}
        />
        
        {preview ? (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img src={preview} alt="Fridge content" className="w-full h-64 object-cover" />
            <button 
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 h-64 border-2 border-dashed border-emerald-300 rounded-3xl flex flex-col items-center justify-center gap-4 bg-emerald-50/50 hover:bg-emerald-50 transition-colors group"
            >
              <div className="p-5 bg-white rounded-full shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-4xl">📸</span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-emerald-800 text-lg">{t.snapFridge}</p>
                <p className="text-xs text-emerald-600 mt-1">{t.analyzeSub}</p>
              </div>
            </button>
            
            <button 
              onClick={toggleListening}
              className={`w-24 h-64 border-2 border-dashed border-emerald-300 rounded-3xl flex flex-col items-center justify-center gap-4 transition-colors ${
                isListening 
                  ? 'bg-red-50 border-red-400 animate-pulse' 
                  : 'bg-emerald-50/50 hover:bg-emerald-50'
              }`}
            >
               <div className={`p-4 bg-white rounded-full shadow-lg transition-transform ${isListening ? 'scale-110 ring-4 ring-red-200' : 'group-hover:scale-110'}`}>
                <span className="text-2xl">{isListening ? '🛑' : '🎙️'}</span>
              </div>
              <div className="text-center px-1">
                <p className={`font-semibold text-xs mt-1 ${isListening ? 'text-red-600' : 'text-emerald-800'}`}>
                  {isListening ? 'Listening...' : 'Voice Input'}
                </p>
              </div>
            </button>
          </div>
        )}
      </div>

      <button
        disabled={!preview || isLoading}
        onClick={handleStart}
        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2
          ${!preview || isLoading 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'}`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {t.analyzing}
          </>
        ) : (
          <>
            🍳 {t.getRecipes}
          </>
        )}
      </button>
    </div>
  );
};