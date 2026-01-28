
export enum Category {
  Vegetables = "Vegetables",
  Dairy = "Dairy",
  Fruits = "Fruits",
  Proteins = "Proteins",
  Others = "Others"
}

export interface DetectedItem {
  name: string;
  category: Category;
  freshness: string;
}

export interface Recipe {
  id: string;
  nameEn: string;
  nameHi: string;
  time: string;
  difficulty: "Easy" | "Medium";
  whyFit: string;
  ingredientsEn: string[];
  ingredientsHi: string[];
  stepsEn: string[];
  stepsHi: string[];
  calories: string;
  servingSize: string;
  isQuick: boolean;
  isNoGas: boolean;
}

export interface AnalysisResult {
  detectedItems: DetectedItem[];
  recipes: Recipe[];
  foodSavingTips: string[];
  safetyNotes: string[];
}

export interface Preferences {
  diet: "Veg" | "Non-Veg";
  timeAvailable: number; // minutes
  servings: number;
}
