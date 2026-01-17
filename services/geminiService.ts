
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult } from "../types";

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Brak klucza API Gemini. Skonfiguruj klucz w ustawieniach środowiska.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          { text: "Przeprowadź audyt techniczny rozdzielnicy. Zidentyfikuj bezpieczniki, ochronniki i ich stan. Wyszukaj aktualne ceny rynkowe dla tych komponentów w Polsce. Przygotuj ofertę modernizacji i e-mail do klienta." },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tytul: { type: Type.STRING },
            opis: { type: Type.STRING },
            detale: { type: Type.ARRAY, items: { type: Type.STRING } },
            ocena_techniczna: { type: Type.STRING },
            jakosc_budowy: { type: Type.STRING },
            komponenty: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nazwa: { type: Type.STRING },
                  typ: { type: Type.STRING },
                  opis: { type: Type.STRING }
                }
              }
            },
            ceny_szacunkowe: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  element: { type: Type.STRING },
                  cena: { type: Type.STRING }
                }
              }
            },
            oferta: {
              type: Type.OBJECT,
              properties: {
                punkty_kluczowe: { type: Type.ARRAY, items: { type: Type.STRING } },
                rekomendacje: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            email_draft: { type: Type.STRING },
            zgodnosc_z_normami: { type: Type.STRING },
            klauzula_bezpieczenstwa: { type: Type.STRING }
          },
          required: ["tytul", "opis", "detale", "ocena_techniczna", "jakosc_budowy", "komponenty", "ceny_szacunkowe", "oferta", "email_draft", "zgodnosc_z_normami", "klauzula_bezpieczenstwa"]
        }
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Nie udało się uzyskać analizy od modelu AI.");
    }

    return JSON.parse(resultText) as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Twój klucz API jest nieprawidłowy dla modelu Gemini. Pamiętaj, że klucze OpenAI nie działają z modelem Gemini.");
    }
    throw error;
  }
};
