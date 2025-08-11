const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connectDB=require('./config/DB.js');
const generateRES = require('./controller/controller.js');


app.use(express.json());


app.post('/',generateRES)

app.listen(process.env.PORT, () => {
    connectDB();
    console.log('Server is running on port 8k!');
});
