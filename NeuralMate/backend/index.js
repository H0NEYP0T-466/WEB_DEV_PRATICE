const express = require('express');
const app = express();
const dotenv = require('dotenv');
const router = express.Router();
const axios = require('axios');
dotenv.config();
const connectDB=require('./config/DB.js');
const {generateRES} = require('./controller/controller.js');
const cors = require('cors');
app.use(cors());
const { insertChatMessage } = require('./config/saveMessages.js');
const {getMessages}=require('./controller/controller.js');


app.use(express.json());

app.post('/api/gemini', generateRES);


app.get('/api/get-messages',getMessages)

app.post('/api/save-message', async (req, res) => {
  try {
    const { userName, assistantName, sender, text } = req.body;
    const savedUser = await insertChatMessage(userName, assistantName, sender, text);
    res.json({ success: true, data: savedUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/translate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, error: 'Text is required' });
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: 'hi|en'
      }
    });

    const translatedText = response.data.responseData.translatedText || text;
    res.json({ success: true, text: translatedText });
  } catch (err) {
    console.error('Translation error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(process.env.PORT, () => {
    connectDB();
    console.log('Server is running on port 8k!');
});
