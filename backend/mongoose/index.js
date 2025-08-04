let express = require('express');
let app = express();
let mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.dburl)
  .then(() => console.log('MongoDB connected'))

  app.listen(8000)