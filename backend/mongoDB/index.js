let express=require('express');
let app=express();

app.use(express.json());


app.get('/studentRead', (req, res) => {
    res.send('Student Read API');
});

app.post('/studentInsert', (req, res) => {
    res.send('Student Insert API');
});


app.listen(8000)