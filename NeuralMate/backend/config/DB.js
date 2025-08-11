const mongoose = require('mongoose');


const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.mongoDB_URL);
        console.log("MongoDB connected");
    } catch (err) {
        console.log(err);
    }
};

module.exports=connectDB;