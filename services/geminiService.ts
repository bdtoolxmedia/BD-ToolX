import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || '';
  return new GoogleGenAI({ apiKey });
};

export const generatePostContent = async (topic: string, platform: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a viral social media post for ${platform} about: ${topic}.`,
    });
    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("AI Error:", error);
    return "AI Node offline. Please check configuration.";
  }
};

export const analyzePerformance = async (data: any): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this data: ${JSON.stringify(data)}`,
    });
    return response.text || "Analysis unavailable.";
  } catch (error) {
    return "Analytics Node offline.";
  }
};