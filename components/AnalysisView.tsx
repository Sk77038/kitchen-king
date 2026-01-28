import React, { useState } from 'react';
import { AnalysisResult, Category, Recipe } from '../types';
import { RecipeModal } from './RecipeModal';
import { useLanguage } from '../LanguageContext';

interface AnalysisViewProps {
  data: AnalysisResult;
  onBack: () => void;
  savedRecipes: Recipe[];
  onToggleSave: (recipe: Recipe) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ data, onBack, savedRecipes, onToggleSave }) => {
  const { t } = useLanguage();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filterQuick, setFilterQuick] = useState(false);
  const [filterNoGas, setFilterNoGas] = useState(false);

  const categories: Category[] = [Category.Vegetables, Category.Dairy, Category.Fruits, Category.Proteins, Category.Others];

  const isRecipeSaved = (recipe: Recipe) => {
    return savedRecipes.some(r => r.id === recipe.id || (r.nameEn === recipe.nameEn && r.nameHi === recipe.nameHi));
  };

  const filteredRecipes = data.recipes.filter(recipe => {
    if (filterQuick && !recipe.isQuick) return false;
    if (filterNoGas && !recipe.isNoGas) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
        ← {t.startOver}
      </button>

      {/* Safety Warnings */}
      {data.safetyNotes.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <h3 className="text-red-800 font-bold mb-2 flex items-center gap-2">
            ⚠️ {t.safetyNotes}
          </h3>
          <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
            {data.safetyNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Detected Items */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          📸 {t.detectedItems}
        </h2>
        <div className="space-y-4">
          {categories.map(cat => {
            const items = data.detectedItems.filter(item => item.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{cat}</h4>
                <div className="flex flex-wrap gap-2">
                  {items.map((item, idx) => (
                    <span key={idx} className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border ${
                      item.freshness.toLowerCase().includes('fresh') 
                      ? 'bg-emerald-100 border-emerald-200 text-emerald-800' 
                      : 'bg-yellow-100 border-yellow-200 text-yellow-800'
                    }`}>
                      {item.name} ({item.freshness})
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recipes */}
      <section>
        <div className="flex flex-col gap-3 mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🍽️ {t.recipes}
          </h2>
          
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setFilterQuick(!filterQuick)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-2 ${
                filterQuick 
                ? 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-sm ring-2 ring-yellow-200' 
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span>⚡</span> {t.quickMode}
            </button>
            <button 
              onClick={() => setFilterNoGas(!filterNoGas)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-2 ${
                filterNoGas 
                ? 'bg-emerald-400 border-emerald-500 text-emerald-900 shadow-sm ring-2 ring-emerald-200' 
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span>🥗</span> {t.noGas}
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <button 
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="text-left bg-white border border-emerald-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-3 flex gap-2">
                  {isRecipeSaved(recipe) && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black uppercase">⭐ {t.saved}</span>}
                  {recipe.isQuick && <span className="text-[10px] bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-black uppercase">⚡ 15m</span>}
                  {recipe.isNoGas && <span className="text-[10px] bg-emerald-400 text-emerald-900 px-2 py-0.5 rounded-full font-black uppercase">🥗 {t.noGas}</span>}
                </div>
                <h3 className="text-lg font-bold text-gray-900 pr-12">{recipe.nameEn}</h3>
                <p className="text-emerald-600 text-sm font-medium mb-2">{recipe.nameHi}</p>
                <div className="flex gap-4 text-xs text-gray-500 font-semibold mt-4 border-t pt-4 border-emerald-50">
                  <span className="flex items-center gap-1">⏱️ {recipe.time}</span>
                  <span className="flex items-center gap-1">📈 {recipe.difficulty}</span>
                  <span className="flex items-center gap-1">🔥 {recipe.calories}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-gray-400 font-medium text-sm">{t.noRecipesMatch}</p>
              <button 
                onClick={() => { setFilterQuick(false); setFilterNoGas(false); }}
                className="mt-2 text-emerald-600 text-xs font-bold hover:underline"
              >
                {t.clearFilters}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Food Saving Tips */}
      <section className="bg-emerald-50 rounded-3xl p-6">
        <h3 className="text-emerald-900 font-bold mb-3 flex items-center gap-2">
          ♻️ {t.foodSavingTips}
        </h3>
        <ul className="space-y-2">
          {data.foodSavingTips.map((tip, i) => (
            <li key={i} className="text-sm text-emerald-800 flex gap-2">
              <span className="shrink-0">🌱</span>
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isSaved={isRecipeSaved(selectedRecipe)}
          onToggleSave={() => onToggleSave(selectedRecipe)}
          availableIngredients={data.detectedItems.map(i => i.name)}
        />
      )}
    </div>
  );
};