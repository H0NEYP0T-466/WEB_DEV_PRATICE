let express = require("express");
let mongoose=require("mongoose");
const cors = require('cors');
const router = require('../Server/routes/web/enquiryRoutes');
let app=express();
let {enquiryInsert,enquiryDelete,getAllEnquiries,enquiryUpdate}=require('../Server/controller/web/controller');
app.use(express.json());
app.use(cors());



app.post('/insert',enquiryInsert);
app.post('/delete',enquiryDelete);
app.post('/update',enquiryUpdate);
app.get('/enquiries',getAllEnquiries);

mongoose.connect('mongodb://127.0.0.1/mernStackProject',{autoIndex: false}).then(()=>{
    
    console.log("Database Sucessfully Connected....");
    app.listen(8000)
})
.catch((err)=>
{
    console.log(err);
})



