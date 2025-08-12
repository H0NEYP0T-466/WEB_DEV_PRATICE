const express = require('express');
const app = express();
const dotenv = require('dotenv');
const router = express.Router();
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

app.listen(process.env.PORT, () => {
    connectDB();
    console.log('Server is running on port 8k!');
});
