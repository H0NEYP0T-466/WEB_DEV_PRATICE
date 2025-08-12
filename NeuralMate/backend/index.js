const express = require('express');
const app = express();
const dotenv = require('dotenv');
const router = express.Router();
dotenv.config();
const connectDB=require('./config/DB.js');
const generateRES = require('./controller/controller.js');
const cors = require('cors');
app.use(cors());
const { insertChatMessage } = require('./config/saveMessages.js');


app.use(express.json());

app.post('/api/gemini', generateRES);
app.post('/api/save-message', async (req, res) => {
  const { name, assistantname, sender, text } = req.body;

  try {
    const user = await insertChatMessage(name, assistantname, sender, text);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(process.env.PORT, () => {
    connectDB();
    console.log('Server is running on port 8k!');
});
