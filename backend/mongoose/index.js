const express = require('express');
const mongoose = require('mongoose');
const UserData = require('./models/userData.model.js'); 
const { insert, deleteUser, update ,printALL } = require('./controller/controller.js');
require('dotenv').config();


const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(8000, () => console.log('Server running on port 8000'));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


app.post('/userData',insert)


app.delete('/deleteUser', deleteUser)

app.get('/findUser',printALL)

app.put('/updateUser',update)