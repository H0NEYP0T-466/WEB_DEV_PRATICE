const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connectDB=require('./config/DB.js');
const generateRES = require('./controller/controller.js');
const cors = require('cors');
app.use(cors());


app.use(express.json());

app.post('/api/gemini', generateRES);

app.listen(process.env.PORT, () => {
    connectDB();
    console.log('Server is running on port 8k!');
});
