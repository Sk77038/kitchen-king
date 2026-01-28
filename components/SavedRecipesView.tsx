import React, { useState } from 'react';
import { Recipe } from '../types';
import { RecipeModal } from './RecipeModal';
import { useLanguage } from '../LanguageContext';

interface SavedRecipesViewProps {
  recipes: Recipe[];
  onToggleSave: (recipe: Recipe) => void;
  onBack: () => void;
}

export const SavedRecipesView: React.FC<SavedRecipesViewProps> = ({ recipes, onToggleSave, onBack }) => {
  const { t } = useLanguage();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
          ← {t.back}
        </button>
      </div>

      <header>
        <h2 className="text-2xl font-black text-gray-900">{t.myCookbook}</h2>
        <p className="text-gray-500 text-sm">{t.cookbookSub}</p>
      </header>

      {recipes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <span className="text-4xl block mb-2">📒</span>
          <p className="text-gray-400 font-medium">{t.noSaved}</p>
          <p className="text-xs text-gray-400 mt-1">{t.starRecipes}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {recipes.map((recipe) => (
            <button 
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="text-left bg-white border border-emerald-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3">
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black uppercase">⭐ {t.saved}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 pr-12">{recipe.nameEn}</h3>
              <p className="text-emerald-600 text-sm font-medium mb-2">{recipe.nameHi}</p>
              <div className="flex gap-4 text-xs text-gray-500 font-semibold mt-4 border-t pt-4 border-emerald-50">
                <span className="flex items-center gap-1">⏱️ {recipe.time}</span>
                <span className="flex items-center gap-1">📈 {recipe.difficulty}</span>
                <span className="flex items-center gap-1">🔥 {recipe.calories}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)}
          isSaved={true}
          onToggleSave={() => {
            onToggleSave(selectedRecipe);
          }}
        />
      )}
    </div>
  );
};