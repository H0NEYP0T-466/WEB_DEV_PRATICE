const { User } = require('../model/user.model.js');
const insertChatMessage = async (userName, assistantName, sender, text) => {
  try {
    let user = await User.findOne({ name: userName, assistantname: assistantName });

    if (!user) {

      user = new User({
        name: userName,
        assistantname: assistantName,
        history: []
      });
    }


    user.history.push({ sender, text });
    await user.save();

    console.log('Message saved successfully');
    return user;
  } catch (err) {
    console.error('Error saving message:', err);
    throw err;
  }
};

module.exports = { insertChatMessage };
