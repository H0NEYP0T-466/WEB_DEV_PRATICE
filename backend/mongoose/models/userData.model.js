const mongoose = require('mongoose');
const { Schema } = mongoose;

const userDataSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;