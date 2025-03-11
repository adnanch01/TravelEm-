
import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiResponse = async (prompt: string) => {
  const apiKey = localStorage.getItem("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("Gemini API key not found");
  }

  // Create the generative AI instance with the correct API version
  const genAI = new GoogleGenerativeAI(apiKey);
  // Use gemini-1.5-pro instead of gemini-pro as the model name
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
