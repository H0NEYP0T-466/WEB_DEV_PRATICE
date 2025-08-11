const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        name:
        {
            type: String,
            required: true,
        },
        assistantname:
        {
            type:String,
            required:true,
        },
        history:
        [
            {type:String}
        ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;

