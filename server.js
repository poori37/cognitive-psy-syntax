const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity
    methods: ["GET", "POST"]
  }
});

const groups = {}; // In-memory store for groups

function generateGroupCode() {
    let code;
    do {
        code = Math.floor(100 + Math.random() * 900).toString();
    } while (groups[code]); // Ensure code is unique
    return code;
}

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('createGroup', (playerData) => {
        const groupCode = generateGroupCode();
        const newPlayer = {
            id: socket.id,
            nickname: playerData.nickname,
            score: 0 // Initialize score on the server
        };
        groups[groupCode] = {
            players: [newPlayer],
            gameStarted: false // Game has not started yet
        };
        socket.join(groupCode);
        console.log(`Group created by ${newPlayer.nickname} with code ${groupCode}`);
        socket.emit('groupCreated', { groupCode, players: groups[groupCode].players });
    });

    socket.on('joinGroup', ({ playerData, groupCode }) => {
        const group = groups[groupCode];
        if (group) {
            if (group.gameStarted) {
                socket.emit('joinError', 'Game has already started.');
                return;
            }
            
            const newPlayer = {
                id: socket.id,
                nickname: playerData.nickname,
                score: 0 // Initialize score on the server
            };

            group.players.push(newPlayer);
            socket.join(groupCode);

            console.log(`${newPlayer.nickname} joined group ${groupCode}`);
            
            // 1. Notify the joining user of success so they can switch to the waiting room.
            socket.emit('joinSuccess', { groupCode });
            
            // 2. Broadcast the updated player list to EVERYONE in the group.
            io.to(groupCode).emit('updatePlayers', group.players);
        } else {
            socket.emit('joinError', 'Group not found.');
        }
    });

    socket.on('startGameRequest', (groupCode) => {
        if (groups[groupCode]) {
            groups[groupCode].gameStarted = true;
            console.log(`Start game request received for group ${groupCode}. Starting game.`);
            io.to(groupCode).emit('gameStarted');
        }
    });

    socket.on('updateScore', (playerData) => {
        const { groupCode, id, score } = playerData;
        if (groups[groupCode]) {
            const group = groups[groupCode];
            const player = group.players.find(p => p.id === id);
            if (player) {
                player.score = score;
                // Broadcast the updated player list to everyone in the group
                io.to(groupCode).emit('updatePlayers', group.players);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Find which group the user was in and remove them
        for (const groupCode in groups) {
            const group = groups[groupCode];
            const playerIndex = group.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                group.players.splice(playerIndex, 1);
                console.log(`Removed player from group ${groupCode}`);
                
                // If group is empty, delete it
                if (group.players.length === 0) {
                    delete groups[groupCode];
                    console.log(`Group ${groupCode} is empty and has been deleted.`);
                } else {
                    // Otherwise, notify remaining players
                    io.to(groupCode).emit('updatePlayers', group.players);
                }
                break; // Player can only be in one group
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});