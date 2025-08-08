const express = require('express');
const app = express();
app.use(express.json());
require("dotenv").config();
const generateRES = require('./controller/controller.js');

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/ai',generateRES);




app.listen(8000, () => {
    console.log('Server is running on port 8000');
})
