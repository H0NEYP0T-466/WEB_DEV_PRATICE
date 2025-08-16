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
  const { userName, assistantName, limit = 150 } = req.query;

  try {
    const user = await User.findOne(
      { name: userName, assistantname: assistantName },
      { history: { $slice: -limit } } 
    );

    if (!user) {
      return res.json({ success: true, messages: [] });
    }

    res.json({ success: true, messages: user.history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const saveLastMessageTime = () => {

  const now = new Date().toISOString();
  localStorage.setItem("lastMessageTime", now);
};

const getTimeSinceLastMessage = () => {
  const lastTime = localStorage.getItem("lastMessageTime");
  if (!lastTime) return null;

  const lastDate = new Date(lastTime);
  const now = new Date();
  const diffMs = now - lastDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffDays >= 1) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else if (diffHours >= 1) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  } else {
    return "just a little while";
  }
};




module.exports = {generateRES,getMessages,saveLastMessageTime,getTimeSinceLastMessage};
