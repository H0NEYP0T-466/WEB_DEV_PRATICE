let mongoose = require('mongoose');
let schema=mongoose.Schema;

let userEnquiry= new schema(
    {
        name:{
            type:String,
            required:true
        },
         email:{
            type:String,
            required:true
        },
         phoneNumber:{
            type:String,
            required:true
        },
         message:{
            type:String,
            required:false
        }
    }
)

let Model=mongoose.model('model',userEnquiry);
module.exports=Model;