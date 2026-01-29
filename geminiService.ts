import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Preferences } from "./types";

// Initialize AI using the environment variable as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    detectedItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          freshness: { type: Type.STRING }
        },
        required: ["name", "category", "freshness"]
      }
    },
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          nameEn: { type: Type.STRING },
          nameHi: { type: Type.STRING },
          time: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          whyFit: { type: Type.STRING },
          ingredientsEn: { type: Type.ARRAY, items: { type: Type.STRING } },
          ingredientsHi: { type: Type.ARRAY, items: { type: Type.STRING } },
          stepsEn: { type: Type.ARRAY, items: { type: Type.STRING } },
          stepsHi: { type: Type.ARRAY, items: { type: Type.STRING } },
          calories: { type: Type.STRING },
          servingSize: { type: Type.STRING },
          isQuick: { type: Type.BOOLEAN },
          isNoGas: { type: Type.BOOLEAN }
        },
        required: ["id", "nameEn", "nameHi", "time", "difficulty", "whyFit", "ingredientsEn", "ingredientsHi", "stepsEn", "stepsHi", "calories", "servingSize"]
      }
    },
    foodSavingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    safetyNotes: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["detectedItems", "recipes", "foodSavingTips", "safetyNotes"]
};

const getSystemPrompt = (preferences: Preferences, context: string) => `
    Act as Kitchen King AI. Suggest recipes based on the following context: ${context}
    
    User Preferences:
    - Diet: ${preferences.diet}
    - Time Available: ${preferences.timeAvailable} minutes
    - Servings: ${preferences.servings} people

    Strict Requirements:
    1. If context is text ingredients, acknowledge them in detectedItems.
    2. Generate 3 high-quality recipes using the context items + basic pantry items.
    3. Provide output in both English and Hindi.
    4. Support the user's diet preference (${preferences.diet}).
    5. Include Indian recipes first, then Continental/Quick snacks.
    6. Provide 15-minute "Quick Mode" recipes if possible.
    7. Suggest "No-gas/No-oven" options if ingredients allow.
    8. Include health & safety warnings if applicable.
    9. Include Food Waste Saver tips.
`;

export const analyzeFridgeImage = async (
  base64Image: string,
  preferences: Preferences
): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";
  const prompt = getSystemPrompt(preferences, "an image of a refrigerator's contents");

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return JSON.parse(response.text);
};

export const searchRecipesByIngredients = async (
  ingredients: string,
  preferences: Preferences
): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";
  const prompt = getSystemPrompt(preferences, `the user manually typed these ingredients: ${ingredients}`);

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return JSON.parse(response.text);
};

export const getIngredientSubstitution = async (
  ingredient: string,
  recipeName: string,
  availableIngredients: string[] = []
): Promise<string> => {
  const model = "gemini-3-flash-preview";
  const contextItems = availableIngredients.length > 0 
    ? `Available ingredients in kitchen: ${availableIngredients.join(", ")}.`
    : "";
    
  const prompt = `
    Act as a professional chef.
    The user is making "${recipeName}".
    They are missing this ingredient: "${ingredient}".
    ${contextItems}
    Suggest 1 best suitable substitute. If one of the available ingredients works well, prioritize it.
    Keep the answer friendly and short (max 1 sentence).
    Example: "You can use Greek Yogurt instead."
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "text/plain",
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return response.text || "No substitution found.";
};