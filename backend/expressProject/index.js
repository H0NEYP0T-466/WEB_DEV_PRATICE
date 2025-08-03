let a=require('express');
let b=a();

b.get('/', (req, res) => {
    res.send('home page');
});

b.listen(8080)