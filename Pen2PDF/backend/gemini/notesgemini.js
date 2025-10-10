const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.geminiApiKey || process.env.GEMINI_API_KEY,
});
const PRIMARY_MODEL = "gemini-2.5-pro";
const FALLBACK_MODEL = "gemini-2.5-flash";

/**
 * Centralized helper function to call Gemini API with fallback logic
 * @param {string} primaryModel - Primary model to try first
 * @param {string} fallbackModel - Fallback model if primary fails
 * @param {Array} parts - Content parts to send to the model
 * @param {string} systemInstruction - System instruction for the model
 * @param {string} logPrefix - Prefix for console logs (e.g., "[GEMINI NOTES]")
 * @returns {Promise<Object>} - Object with text and modelUsed
 */
async function callGeminiAPI(primaryModel, fallbackModel, parts, systemInstruction, logPrefix) {
  const models = [primaryModel, fallbackModel];
  let lastErr = null;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const isPrimary = i === 0;
    
    try {
      console.log(`\n🔄 ${logPrefix} Attempting ${model}...`);
      console.log(`📤 ${logPrefix} Sending request to Gemini API...`);
      
      const response = await ai.models.generateContent({
        model,
        contents: parts,
        config: { systemInstruction }
      });

      console.log(`📦 ${logPrefix} Full API response received:`);
      console.log('─'.repeat(80));
      console.log(JSON.stringify(response, null, 2));
      console.log('─'.repeat(80));

      const text = response.text;
      if (!text || text.trim().length === 0) {
        throw new Error("No valid text response received from Gemini.");
      }
      
      console.log(`\n✅ ${logPrefix} ${model} responded successfully.`);
      console.log(`📊 ${logPrefix} Generated content length: ${text.length} characters`);
      console.log(`📝 ${logPrefix} Generated notes content:`);
      console.log('─'.repeat(80));
      console.log(text);
      console.log('─'.repeat(80));
      
      return { text, modelUsed: model };
    } catch (err) {
      lastErr = err;
      const code = err?.status || err?.code;
      const msg = (err?.message || "").toLowerCase();
      
      console.error(`❌ ${logPrefix} Model ${model} failed:`, {
        message: err?.message,
        status: code,
        stack: err?.stack
      });
      
      // Check for retryable errors
      const isQuotaError = code === 429 || msg.includes("quota") || msg.includes("rate limit");
      const isNotFound = code === 404 || msg.includes("not found");
      const isForbidden = code === 403;
      const isServiceUnavailable = code === 503 || msg.includes("overloaded") || msg.includes("unavailable");
      
      const isRetryable = isQuotaError || isNotFound || isForbidden || isServiceUnavailable;
      
      if (isRetryable && !isPrimary) {
        // Already on fallback, no more models to try
        console.error(`❌ ${logPrefix} Fallback model also failed. No more models to try.`);
        break;
      } else if (isRetryable && isPrimary) {
        // Try fallback
        if (isQuotaError) {
          console.log(`⏳ ${logPrefix} Model ${model} quota reached or unavailable, retrying ${fallbackModel}...`);
        } else if (isForbidden) {
          console.log(`🚫 ${logPrefix} Model ${model} access forbidden (403), retrying ${fallbackModel}...`);
        } else if (isNotFound) {
          console.log(`🔍 ${logPrefix} Model ${model} not found (404), retrying ${fallbackModel}...`);
        } else if (isServiceUnavailable) {
          console.log(`⚠️ ${logPrefix} Model ${model} service unavailable (503), retrying ${fallbackModel}...`);
        }
        continue;
      } else {
        // Non-retryable error
        console.log(`❌ ${logPrefix} Non-retryable error for ${model}, stopping attempts.`);
        break;
      }
    }
  }

  console.error(`❌ ${logPrefix} All models failed. Last error:`, lastErr);
  throw lastErr || new Error("Gemini API call failed");
}

async function generateNotesResponse(parts, retryInstruction = null) {
const systemInstruction = `
# 📘 Study Notes Generator

Transform provided files into clean, structured study notes using **Markdown only**.

## 🏗️ Structure
Include sections only if relevant from source content, except mandatory sections marked with ⭐:

* # 📑 Title (infer from content)
* ## 🌐 Overview (3-6 sentences)
* ## ⭐ Key Takeaways (5-10 bullets)
* ## 📂 Concepts (organize by topic with inline citations like (page#X))
* ## ➕ Formulas/Definitions (if applicable - use LaTeX format)
* ## ⚙️ Procedures/Algorithms (if applicable - numbered steps)
* ## 💡 Examples (if applicable)
* ## ❓ Questions for Review — ⭐ MANDATORY (3-9 questions)
* ## ✅ Answers — ⭐ MANDATORY (brief answers to all questions)
* ## 🍼 Teach It Simply — ⭐ MANDATORY LAST SECTION (child-friendly explanations with 2-5 real-world analogies)

## 🎯 Rules
* Your **goal is NOT to make the notes long** — focus on delivering *concise, clear study notes only*.
* Discard any unnecessary or irrelevant material from the provided source.
* **Make the notes exam-focused:** after the heading of a topic, if the topic is especially important for exams, add **(IMP*)** right after the heading.
* Use H1/H2/H3 headings only.
* **All headings and bullet points must include relevant emojis**
* Bold key terms on first mention
* Academic tone (except "Teach It Simply" section)
* Include inline source citations: (slide#X) or (page#X)
* No invented facts — use only content from provided files.

## 📐 LaTeX Formatting Rules (CRITICAL for Formulas/Definitions section)
* **ALWAYS use proper LaTeX delimiters:**
  - For inline math: Use single dollar signs like \`$formula$\`
  - For display/block math: Use double dollar signs like \`$$formula$$\`
* **Examples of CORRECT LaTeX formatting:**
  - Inline: \`$s = T(r)$\` or \`$g(x,y) = T[f(x,y)]$\`
  - Display: \`$$s = c \\cdot \\log(1+r)$$\` or \`$$p(r_k) = \\frac{n_k}{MN}$$\`
* **Use proper LaTeX syntax:**
  - Multiplication: Use \`\\cdot\` for dot product (e.g., \`$c \\cdot r$\`)
  - Fractions: Use \`\\frac{numerator}{denominator}\` (e.g., \`$\\frac{a}{b}$\`)
  - Superscripts: Use \`^\` for powers (e.g., \`$r^\\gamma$\`)
  - Subscripts: Use \`_\` for subscripts (e.g., \`$r_k$\`)
  - Greek letters: Use backslash (e.g., \`$\\gamma$\`, \`$\\theta$\`, \`$\\alpha$\`)
  - Integrals: Use \`\\int\` (e.g., \`$\\int_0^r f(x)dx$\`)
  - Summations: Use \`\\sum\` (e.g., \`$\\sum_{i=1}^{n} x_i$\`)
* **NEVER write formulas as plain text** - always wrap them in LaTeX delimiters
* **Each formula MUST be complete and valid LaTeX** - test mentally if it would render correctly

${retryInstruction ? `\n\nAdditional instruction: ${retryInstruction}` : ''}
`;

  console.log('🔄 [GEMINI NOTES] Starting notes generation with model fallback strategy');
  console.log('📋 [GEMINI NOTES] System instruction:', systemInstruction.substring(0, 200) + '...');
  console.log(`📊 [GEMINI NOTES] Primary model: ${PRIMARY_MODEL}, Fallback: ${FALLBACK_MODEL}`);

  return await callGeminiAPI(PRIMARY_MODEL, FALLBACK_MODEL, parts, systemInstruction, '[GEMINI NOTES]');
}

module.exports = { generateNotesResponse };