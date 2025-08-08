const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.geminiApiKey,
});

async function generateGeminiResponse(userPrompt) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    });
    console.log("📦 Raw Gemini API response:");
    console.dir(result, { depth: null });
    const text =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      result.text ||
      null;

    if (!text) {
      throw new Error("No valid text response received from Gemini.");
    }

    return text;
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    return "Error generating response.";
  }
}

module.exports = generateGeminiResponse;
