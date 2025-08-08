const express = require('express');
const app = express();
app.use(express.json());
require("dotenv").config();
const cors = require('cors');
const generateRES = require('./controller/controller.js');
app.use(cors());

app.post('/reveiw',generateRES);




app.listen(8000, () => {
    console.log('Server is running on port 8000');
})
