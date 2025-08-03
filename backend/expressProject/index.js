let a=require('express');
let b=a();

b.use(a.json());

b.get('/', (req, res) => {
    res.send('home page');
});

b.get('/users', (req, res) => {
    let a = req.params.id;
    res.send('users page',a);
});


b.get('/users:id', (req, res) => {
  let a = req.params.id;
    res.send('users page'+a)
});

b.post('/login', (req, res) => {
    console.log(req.body);
});

b.listen(8000)