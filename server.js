const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// In-memory storage for game groups
const groups = {};

// Serve static files from the project's root directory.
app.use(express.static(__dirname));

// Health check route
app.get("/health", (req, res) => {
    res.status(200).send({ status: "ok" });
});

// Helper to generate a unique 3-digit group code
function generateGroupCode() {
    let code;
    do {
        code = Math.floor(100 + Math.random() * 900).toString();
    } while (groups[code]); // Ensure code is unique
    return code;
}

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Store which group the socket is in
    let currentGroupCode = null;

    socket.on('createGroup', (playerData) => {
        const groupCode = generateGroupCode();
        currentGroupCode = groupCode;
        groups[groupCode] = {
            players: [playerData],
            proficiency: 'easy' // default
        };
        socket.join(groupCode);
        socket.emit('groupCreated', { groupCode, players: groups[groupCode].players });
        console.log(`Group ${groupCode} created by ${playerData.nickname}`);
    });

    socket.on('joinGroup', ({ playerData, groupCode }) => {
        if (!groups[groupCode]) {
            socket.emit('joinError', 'Group does not exist.');
            return;
        }
        
        // Add player to the group
        groups[groupCode].players.push(playerData);
        currentGroupCode = groupCode;
        socket.join(groupCode);

        // Notify the new player of success
        socket.emit('joinSuccess', { groupCode });
        // Update all players in the group
        io.to(groupCode).emit('updatePlayers', groups[groupCode].players);
        console.log(`${playerData.nickname} joined group ${groupCode}`);
    });

    socket.on('setProficiency', ({ groupCode, proficiency }) => {
        if (groups[groupCode]) {
            groups[groupCode].proficiency = proficiency;
        }
    });

    socket.on('startGameRequest', ({ groupCode, proficiency }) => {
        if (groups[groupCode]) {
            // Ensure proficiency is set from the host's final request
            groups[groupCode].proficiency = proficiency;
            io.to(groupCode).emit('gameStarted', { proficiency });
            console.log(`Game started for group ${groupCode}`);
        }
    });

    socket.on('updateScore', (playerData) => {
        const groupCode = playerData.groupCode;
        if (groups[groupCode]) {
            const playerIndex = groups[groupCode].players.findIndex(p => p.id === playerData.id);
            if (playerIndex !== -1) {
                groups[groupCode].players[playerIndex].score = playerData.score;
                io.to(groupCode).emit('updatePlayers', groups[groupCode].players);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        if (currentGroupCode && groups[currentGroupCode]) {
            // Remove player from group
            groups[currentGroupCode].players = groups[currentGroupCode].players.filter(p => p.id !== socket.id);
            
            // If group is now empty, delete it
            if (groups[currentGroupCode].players.length === 0) {
                delete groups[currentGroupCode];
                console.log(`Group ${currentGroupCode} is empty and has been deleted.`);
            } else {
                // Otherwise, update remaining players
                io.to(currentGroupCode).emit('updatePlayers', groups[currentGroupCode].players);
                console.log(`Updated players in group ${currentGroupCode}`);
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});