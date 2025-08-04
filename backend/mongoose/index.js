const express = require('express');
const mongoose = require('mongoose');
const UserData = require('./models/userData.model.js'); 
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


app.delete('/deleteUser', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await UserData.deleteOne({ email: email });
    res.status(200).send(`User with email ${email} deleted successfully`);
  } catch (error) {
    console.error('Error deleting user data:', error);
    res.status(500).send(`Error deleting user data: ${error.message}`);
  }});

app.get('/findUser', async (req, res) => {
  try {
    const userData = await UserData.find();
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send(`Error fetching user data: ${error.message}`);
  }
});

app.put('/updateUser', async (req, res) => {
    let result = await UserData.updateOne({name:"honeypot"}, {$set: {age: 39}});
    res.send('User updated: ' + result.modifiedCount);
});