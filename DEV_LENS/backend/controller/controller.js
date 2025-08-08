const generateGeminiResponse = require('../model/ai_model.js');
const generateRES= async (req, res) => {
  try {
    const prompt = req.query.q || "Hello?"; 
    const reply = await generateGeminiResponse(prompt);
    res.send(reply);
  } catch (err) {
    console.error("❌ Error in /ai route:", err.message);
    res.status(500).send("Something went wrong with Gemini.");
  }
};

module.exports = generateRES;