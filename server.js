const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity in local development
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
        playerData.id = socket.id; // Ensure player ID is the socket ID
        groups[groupCode] = {
            players: [playerData]
        };
        socket.join(groupCode);
        playerData.groupCode = groupCode;
        console.log(`Group created by ${playerData.nickname} with code ${groupCode}`);
        socket.emit('groupCreated', { groupCode, players: groups[groupCode].players });
    });

    socket.on('joinGroup', ({ playerData, groupCode }) => {
        if (groups[groupCode]) {
            playerData.id = socket.id;
            const group = groups[groupCode];
            group.players.push(playerData);
            socket.join(groupCode);
            playerData.groupCode = groupCode;

            console.log(`${playerData.nickname} joined group ${groupCode}`);
            
            // Notify the user who just joined
            socket.emit('joinSuccess', { groupCode, players: group.players });
            
            // Update all other users in the group
            io.to(groupCode).emit('updatePlayers', group.players);
        } else {
            socket.emit('joinError', 'Group not found.');
        }
    });

    socket.on('startGameRequest', (groupCode) => {
        if (groups[groupCode]) {
            console.log(`Start game request received for group ${groupCode}.`);
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