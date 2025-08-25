let express=require('express');
let app=express();
require('dotenv').config();
let a=process.env.token;
console.log('Token from .env:', a); 
app.use(middleware)



app.get('/', (req, res) => {
    res.send('Hello World Honeypot');
});

app.get('/news', (req, res) => {
    let a= req.query.id;
    res.send('This is the news page'+a);
});

function middleware(req, res, next) {

    if(req.query.id !== a) {
         let b= req.query.id;
  
        return res.status(401).send('Unauthorized'+b);    
}
next();
}

app.listen(8000)