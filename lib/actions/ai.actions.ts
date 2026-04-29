"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// We check both for backward compatibility temporarily, but strongly encourage just GEMINI_API_KEY
const apiKey: string = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function generateAIResponse(prompt: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined. Please add it to your .env.local file.");
  }
  
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });
  
  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
}
