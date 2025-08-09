const express = require('express');
const socket = require('socket.io');
const http = require('http');
const {Chess} = require('chess.js');
const path = require('path');



const app = express();
const server= http.createServer(app);
const io = socket(server);


const chess = new Chess();
let players={};
let currentPlayer={};

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.render('app' ,{title:"ChessVision"});
});

io.on('connection',(socket)=>{
    console.log('player connected');

    socket.on('disconnect',()=>{
        console.log('player disconnected');
    });
});


server.listen(3000,()=>{
    console.log('server is running on port 3000');
});



