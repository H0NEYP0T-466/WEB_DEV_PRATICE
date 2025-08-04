let express=require('express');
let dbConnection = require('../mongoDB/dbConnection');
let app=express();

app.use(express.json());


app.get('/studentRead', async(req, res) => {

     let db = await dbConnection();
    let collection = db.collection('students');
    let data= await collection.find().toArray();
    res.send(data);
});

app.post('/studentInsert', async(req, res) => {
    let db = await dbConnection();
    let collection = db.collection('students');
    let object=
    {
        sName:req.body.sName,
        sAge:req.body.sAge,
    }

    console.log(object);
    let result = await collection.insertOne(object);
    console.log(result);
    res.send('Student Insert API'+result);
});


app.listen(8000)