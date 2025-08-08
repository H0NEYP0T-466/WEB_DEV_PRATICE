const express = require('express');
const app = express();
app.use(express.json());
require("dotenv").config();
const generateGeminiResponse = require('./model/ai_model.js');




app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/ai', async (req, res) => {
  try {
    const prompt = req.query.q || "Hello?"; 
    const reply = await generateGeminiResponse(prompt);
    res.send(reply);
  } catch (err) {
    console.error("❌ Error in /ai route:", err.message);
    res.status(500).send("Something went wrong with Gemini.");
  }
});




app.listen(8000, () => {
    console.log('Server is running on port 8000');
})
