const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String, // "Honeypot" or "Isabella"
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  assistantname: {
    type: String,
    required: true,
  },
  history: [messageSchema] // Store each message as an object
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = {User,Message};

