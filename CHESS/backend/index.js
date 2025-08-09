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
let currentPlayer = "w";
let gameOver = false; // ✅ Prevents moves after game ends

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

    // Assign roles
    if (!players.white) {
        players.white = socket.id;
        socket.emit('playerRole', 'w');
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit('playerRole', 'b');
    } else {
        socket.emit('spectatorRole');
    }

    socket.on('move', (move) => {
        try {
            if (gameOver) return; // ✅ No moves allowed after game end

            if (chess.turn() === "w" && players.white !== socket.id) return;
            if (chess.turn() === "b" && players.black !== socket.id) return;

            const res = chess.move(move);

            if (res) {
                currentPlayer = chess.turn();
                io.emit('move', move);
                io.emit("boardState", chess.fen());

                // ✅ Check for game over conditions
                if (chess.isCheckmate()) {
                    const winner = chess.turn() === "w" ? "Black" : "White";
                    io.emit("gameOver", { type: "checkmate", winner });
                    gameOver = true;
                } else if (chess.isStalemate()) {
                    io.emit("gameOver", { type: "stalemate" });
                    gameOver = true;
                } else if (chess.isDraw()) {
                    io.emit("gameOver", { type: "draw" });
                    gameOver = true;
                }

            } else {
                console.log("Invalid move");
                socket.emit("invalidMove", move);
            }
        } catch (err) {
            console.log(err);
            socket.emit("invalidMove", move);
        }
    });
});

server.listen(3000, () => {
    console.log('server is running on port 3000');
});
