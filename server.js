const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files from the project's root directory.
app.use(express.static(__dirname));

// Add a health check route for the hosting platform
app.get("/health", (req, res) => {
    res.status(200).send({ status: "ok" });
});

// In-memory store for multiplayer groups
const groups = {};

// Helper to generate a unique 3-digit group code
function generateGroupCode() {
    let code;
    do {
        // Generates a code between 100 and 999
        code = Math.floor(100 + Math.random() * 900).toString();
    } while (groups[code]); // Ensure code is unique
    return code;
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('createGroup', (playerData) => {
        const groupCode = generateGroupCode();
        groups[groupCode] = {
            players: [{ ...playerData, id: socket.id, score: 0 }],
            proficiency: 'easy' // default proficiency
        };
        socket.join(groupCode);
        socket.emit('groupCreated', { groupCode, players: groups[groupCode].players });
    });

    socket.on('joinGroup', ({ playerData, groupCode }) => {
        if (groups[groupCode]) {
            // Add player to the group
            groups[groupCode].players.push({ ...playerData, id: socket.id, score: 0 });
            socket.join(groupCode);
            // Notify the joining player of success
            socket.emit('joinSuccess', { groupCode });
            // Notify all players in the group about the updated player list
            io.to(groupCode).emit('updatePlayers', groups[groupCode].players);
        } else {
            socket.emit('joinError', 'Group not found.');
        }
    });

    socket.on('setProficiency', ({ groupCode, proficiency }) => {
        if (groups[groupCode]) {
            groups[groupCode].proficiency = proficiency;
        }
    });

    socket.on('startGameRequest', ({ groupCode, proficiency }) => {
        if (groups[groupCode]) {
            // Ensure the request is from the host (the first player in the list)
            if (groups[groupCode].players.length > 0 && groups[groupCode].players[0].id === socket.id) {
                groups[groupCode].proficiency = proficiency;
                io.to(groupCode).emit('gameStarted', { proficiency: groups[groupCode].proficiency });
            }
        }
    });

    socket.on('updateScore', (playerData) => {
        // The client sends its entire playerData object, which now includes the groupCode
        const { groupCode } = playerData;
        if (groupCode && groups[groupCode]) {
            const playerIndex = groups[groupCode].players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                groups[groupCode].players[playerIndex].score = playerData.score;
                io.to(groupCode).emit('updatePlayers', groups[groupCode].players);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Find which group the player was in and remove them
        for (const groupCode in groups) {
            const playerIndex = groups[groupCode].players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                groups[groupCode].players.splice(playerIndex, 1);
                
                // If the group is now empty, delete it
                if (groups[groupCode].players.length === 0) {
                    delete groups[groupCode];
                    console.log(`Group ${groupCode} deleted.`);
                } else {
                    // Otherwise, notify remaining players of the change
                    io.to(groupCode).emit('updatePlayers', groups[groupCode].players);
                }
                break; // A player can only be in one group
            }
        }
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});