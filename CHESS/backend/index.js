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
    console.log('player connected', socket.id);

    // Assign color
    if (!players.white) {
        players.white = socket.id;
        socket.emit('playerRole', 'w');
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit('playerRole', 'b');
    } else {
        socket.emit('spectatorRole');
    }

    socket.on('disconnect', () => {
        if (players.white === socket.id) delete players.white;
        if (players.black === socket.id) delete players.black;
        console.log('player disconnected', socket.id);
    });

   socket.on('move', (move) => {
    try {
        if (chess.turn() === 'w' && players.white !== socket.id) return;
        if (chess.turn() === 'b' && players.black !== socket.id) return;

        if (move.promotion && !isPromotionMove(move)) {
            delete move.promotion;
        }

        const result = chess.move(move);
        if (result) {
            io.emit('move', move);
            io.emit('boardState', chess.fen());

            // Check for game over after this move
            if (chess.isGameOver()) {
                if (chess.isCheckmate()) {
                    let winner = (chess.turn() === 'w') ? 'Black' : 'White';
                    io.emit('gameOver', { result: `${winner} wins by checkmate` });
                } else if (chess.isDraw()) {
                    io.emit('gameOver', { result: 'Draw' });
                } else if (chess.isStalemate()) {
                    io.emit('gameOver', { result: 'Draw by stalemate' });
                }
            }
        } else {
            socket.emit('invalidMove', move);
        }
    } catch (err) {
        console.error(err);
        socket.emit('invalidMove', move);
    }
});

});

// Helper to check if move is a valid promotion
function isPromotionMove(move) {
    return (
        (move.from[1] === '7' && move.to[1] === '8') || // White pawn promoting
        (move.from[1] === '2' && move.to[1] === '1')    // Black pawn promoting
    );
}

server.listen(3000, () => {
    console.log('server is running on port 3000');
});
