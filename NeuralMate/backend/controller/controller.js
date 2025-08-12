const generateGeminiResponse = require("../gemini/ai.model");
const { User } = require('../model/user.model.js');

const generateRES = async (req, res) => {
  try {
    console.log('Received request at /api/gemini with body:', req.body);
    
    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const reply = await generateGeminiResponse(prompt);

    // Respond with JSON for consistency
    res.json({ text: reply });
  } catch (err) {
    console.error("❌ Error in /api/gemini route:", err.message);
    res.status(500).json({ error: "Something went wrong with Gemini." });
  }
};




const getMessages= async (req, res) => {
  const { userName, assistantName, limit = 50 } = req.query;

  try {
    const user = await User.findOne(
      { name: userName, assistantname: assistantName },
      { history: { $slice: -limit } } // Only get the last 'limit' messages
    );

    if (!user) {
      return res.json({ success: true, messages: [] });
    }

    res.json({ success: true, messages: user.history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



module.exports = {generateRES,getMessages};
