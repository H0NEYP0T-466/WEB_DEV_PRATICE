const express = require('express');
const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('app', { title: "ChessVision" });
});

io.on('connection', (socket) => {
    console.log('player connected');

    socket.on('disconnect', () => {
        if (players.white === socket.id) {
            delete players.white;
        } else if (players.black === socket.id) {
            delete players.black;
        }
        console.log('player disconnected');
    });

    if (!players.white) {
        players.white = socket.id;
        socket.emit('playerRole', 'w'); // ✅ fixed typo
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit('playerRole', 'b'); // ✅ fixed typo
    } else {
        socket.emit('spectatorRole');
    }

    socket.on('move', (move) => {
        try {
            if (chess.turn() === "w" && players.white !== socket.id) return;
            if (chess.turn() === "b" && players.black !== socket.id) return;

            const res = chess.move(move);
            if (res) {
                io.emit('move', move);
                io.emit("boardState", chess.fen());
            } else {
                socket.emit("invalidMove", move);
            }
        } catch (err) {
            console.error(err);
            socket.emit("invalidMove", move);
        }
    });
});

server.listen(3000, () => {
    console.log('server is running on port 3000');
});
