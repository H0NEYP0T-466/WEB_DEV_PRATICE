const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connectDB=require('./config/DB.js');


app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
    connectDB();
    console.log('Server is running on port 8k!');
});
