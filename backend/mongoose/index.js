const express = require('express');
const mongoose = require('mongoose');
const UserData = require('./models/userData.model.js'); 
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.dburl)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(8000, () => console.log('Server running on port 8000'));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.post('/userData', async (req, res) => {
  try {
    const { sName, email, age, address } = req.body;

    const newData = new UserData({
      name: sName,
      email: email,
      age: age,
      address: address
    });
    await newData.save();
    console.log('User data saved successfully');
    res.status(201).send('User data received and saved');
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).send(`Error saving user data: ${error.message}`);
  }
});