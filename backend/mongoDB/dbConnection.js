const { MongoClient } = require('mongodb');
let connection = 'mongodb://127.0.0.1:27017';
let client = new MongoClient(connection);
const dbName = 'Students';

let dbConnection=async()=>
{
   await client.connect();
   let db= client.db("projcet");
    return db;
}
module.exports = dbConnection;