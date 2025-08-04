let express=require('express');
const { ObjectId } = require('mongodb');
let dbConnection = require('../mongoDB/dbConnection');
let app=express();

app.use(express.json());



app.get('/studentRead', async(req, res) => {

     let db = await dbConnection();
    let collection =  db.collection('students');
    let data= await collection.find().toArray();
    res.send(data);
});

app.delete('/studentDelete', async(req, res) => {

     let db = await dbConnection();
    let collection =  db.collection('students');
    let id = "6891105706d8cbe25bb7eaaa";
    let result = await collection.deleteOne({_id: new ObjectId(id)});
    res.send('Student Deleted: ' + result.deletedCount);
});


app.put('/studentUpdate', async(req, res) => {

     let db = await dbConnection();
    let collection =  db.collection('students');
    let result = await collection.updateOne({sName:"kratos"}, {$set: {sAge: 39}});
    res.send('Student updated: ' + result.modifiedCount);
});
app.post('/studentInsert',middleware, async(req, res) => {
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

async function middleware(req, res, next) {
    let db = await dbConnection();
    let collection = db.collection('students');
    let a=await collection.find({sName:req.body.sName}).toArray();
    if(a.length === 0)
    {
        next();
    }
    else
    {
        return res.status(401).send('Unauthorized: Student already exists');
    }
    
}


app.listen(8000)