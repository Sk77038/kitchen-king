import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CameraUpload } from './components/CameraUpload';
import { AnalysisView } from './components/AnalysisView';
import { SavedRecipesView } from './components/SavedRecipesView';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { InfoModal, InfoType } from './components/InfoModal';
import { LoginView } from './components/LoginView';
import { analyzeFridgeImage, searchRecipesByIngredients } from './geminiService';
import { AnalysisResult, Preferences, Recipe } from './types';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { AuthProvider, useAuth } from './AuthContext';

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [view, setView] = useState<'home' | 'analysis' | 'saved'>('home');
  const [showTutorial, setShowTutorial] = useState(false);
  const [infoModalType, setInfoModalType] = useState<InfoType | null>(null);
  
  // Local preferences state
  const [prefs, setPrefs] = useState<Preferences>({
    diet: "Veg",
    timeAvailable: 30,
    servings: 2
  });

  // Load recipes based on current user
  useEffect(() => {
    if (user) {
      const key = `recipes_${user.username}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          setSavedRecipes(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse saved recipes", e);
          setSavedRecipes([]);
        }
      } else {
        setSavedRecipes([]);
      }
      
      // Check tutorial for this user
      const tutorialKey = `tutorial_${user.username}`;
      const tutorialDone = localStorage.getItem(tutorialKey);
      if (!tutorialDone) {
        setShowTutorial(true);
      } else {
        setShowTutorial(false);
      }
    }
  }, [user]);

  const handleTutorialComplete = () => {
    if (user) {
      setShowTutorial(false);
      localStorage.setItem(`tutorial_${user.username}`, 'true');
    }
  };

  const handleToggleSave = (recipe: Recipe) => {
    if (!user) return;
    
    const isAlreadySaved = savedRecipes.some(r => r.id === recipe.id || (r.nameEn === recipe.nameEn && r.nameHi === recipe.nameHi));
    
    let updated;
    if (isAlreadySaved) {
      updated = savedRecipes.filter(r => !(r.id === recipe.id || (r.nameEn === recipe.nameEn && r.nameHi === recipe.nameHi)));
    } else {
      updated = [...savedRecipes, recipe];
    }
    
    setSavedRecipes(updated);
    localStorage.setItem(`recipes_${user.username}`, JSON.stringify(updated));
  };

  const handleAnalyze = async (image: string, currentPrefs: Preferences) => {
    setIsLoading(true);
    setError(null);
    setPrefs(currentPrefs);
    try {
      const result = await analyzeFridgeImage(image, currentPrefs);
      setAnalysis(result);
      setView('analysis');
    } catch (err: any) {
      console.error(err);
      setError("Failed to analyze image. Please try a clearer photo.");
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await searchRecipesByIngredients(query, prefs);
      setAnalysis(result);
      setView('analysis');
    } catch (err: any) {
      console.error(err);
      setError("Failed to find recipes for those ingredients.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleVoiceInput = (text: string) => {
    setSearchQuery(text);
    performSearch(text);
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
    setSearchQuery("");
    setView('home');
  };

  const currentView = view; 

  const handleGoHome = () => {
    if (analysis) {
       reset();
    } else {
       setView('home');
    }
  };

  const handleGoBackFromSaved = () => {
    if (analysis) {
      setView('analysis');
    } else {
      setView('home');
    }
  };

  if (isAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <Layout 
      onOpenSaved={() => setView('saved')} 
      onGoHome={handleGoHome}
      activeView={currentView}
      onShowInfo={(type) => setInfoModalType(type)}
    >
      {showTutorial && <OnboardingTutorial onComplete={handleTutorialComplete} />}
      {infoModalType && <InfoModal type={infoModalType} onClose={() => setInfoModalType(null)} />}
      
      {currentView === 'saved' ? (
        <SavedRecipesView 
          recipes={savedRecipes} 
          onToggleSave={handleToggleSave} 
          onBack={handleGoBackFromSaved} 
        />
      ) : currentView === 'analysis' && analysis ? (
        <AnalysisView 
          data={analysis} 
          onBack={reset} 
          savedRecipes={savedRecipes}
          onToggleSave={handleToggleSave}
        />
      ) : (
        // Home View
        <div className="space-y-6 animate-in fade-in duration-300">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-medium animate-bounce mx-4">
              ❌ {error}
            </div>
          )}

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-gray-900">{t.kitchenAI}</h2>
            <p className="text-gray-500 text-sm px-8">{t.kitchenSub}</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="px-4">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full py-4 pl-12 pr-4 bg-white border border-emerald-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale group-focus-within:grayscale-0 transition-all">🔍</span>
              <button 
                type="submit"
                disabled={!searchQuery.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-xl disabled:opacity-50"
              >
                {isLoading && searchQuery ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="text-sm font-bold px-2">{t.go}</span>
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4 px-8">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-[10px] font-black text-gray-300 uppercase">{t.or}</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          <CameraUpload 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading} 
            onVoiceInput={handleVoiceInput}
          />
        </div>
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;