
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiDiagnostic = async (problem: string, vehicleData?: any, imageBase64?: string) => {
  try {
    const parts: any[] = [];
    
    let prompt = `Tu es un expert mécanicien automobile de haut niveau. 
    Analyse le problème suivant pour un véhicule ${vehicleData?.make || ''} ${vehicleData?.model || ''} (${vehicleData?.year || ''}) avec ${vehicleData?.mileage || ''} km.
    Problème signalé : "${problem}".
    
    Fournis un diagnostic structuré avec :
    1. Causes probables (classées par probabilité)
    2. Liste de vérifications immédiates à faire
    3. Gravité (Faible, Moyenne, Critique)
    4. Estimation du temps de réparation.
    
    Réponds de manière concise et technique.`;

    parts.push({ text: prompt });

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64
        }
      });
      prompt += " Analyse également l'image fournie pour identifier des signes de dommages, fuites ou usure.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts }],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "L'assistant IA est temporairement indisponible. Veuillez procéder manuellement.";
  }
};

export const suggestPartsForRepair = async (problem: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Liste les pièces détachées couramment nécessaires pour réparer : "${problem}". Réponds uniquement avec un tableau JSON d'objets { name, urgency }.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { 
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  urgency: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    const data = JSON.parse(response.text || '{"suggestions": []}');
    return data.suggestions;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return [];
  }
};
