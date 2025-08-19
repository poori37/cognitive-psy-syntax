
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// Add a health check route for the hosting platform
app.get("/", (req, res) => {
    res.status(200).send({ status: "ok" });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity
    methods: ["GET", "POST"]
  }
});

const groups = {}; // In-memory store for groups
const NICKNAME_MAX_LENGTH = 15;

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
        const nickname = playerData.nickname ? playerData.nickname.trim() : '';
        if (!nickname) {
            return socket.emit('joinError', 'Nickname is required.'); // Using joinError for simplicity
        }
        
        const finalNickname = nickname.slice(0, NICKNAME_MAX_LENGTH);

        const groupCode = generateGroupCode();
        const newPlayer = {
            id: socket.id,
            nickname: finalNickname,
            score: 0
        };
        groups[groupCode] = {
            players: [newPlayer],
            gameStarted: false,
            proficiency: 'beginner' // Default proficiency
        };
        socket.join(groupCode);
        console.log(`Group created by ${finalNickname} with code ${groupCode}`);
        socket.emit('groupCreated', { groupCode, players: groups[groupCode].players });
    });

    socket.on('joinGroup', ({ playerData, groupCode }) => {
        const trimmedGroupCode = groupCode ? groupCode.trim() : '';
        const group = groups[trimmedGroupCode];
        
        if (!group) {
            return socket.emit('joinError', 'Group not found.');
        }

        if (group.gameStarted) {
            return socket.emit('joinError', 'Game has already started.');
        }
        
        const nickname = playerData.nickname ? playerData.nickname.trim() : '';
        if (!nickname) {
            return socket.emit('joinError', 'Nickname is required.');
        }

        const finalNickname = nickname.slice(0, NICKNAME_MAX_LENGTH);

        if (group.players.some(p => p.nickname.toLowerCase() === finalNickname.toLowerCase())) {
            return socket.emit('joinError', 'That nickname is already taken in this group.');
        }

        if (group.players.some(p => p.id === socket.id)) {
            console.warn(`Player ${socket.id} sent a duplicate join request for group ${trimmedGroupCode}. Ignoring.`);
            return;
        }
        
        const newPlayer = {
            id: socket.id,
            nickname: finalNickname,
            score: 0
        };

        group.players.push(newPlayer);
        socket.join(trimmedGroupCode);

        console.log(`${newPlayer.nickname} joined group ${trimmedGroupCode}`);
        
        socket.emit('joinSuccess', { groupCode: trimmedGroupCode });
        io.to(trimmedGroupCode).emit('updatePlayers', group.players);
    });

    socket.on('setProficiency', (data) => {
        if (!data || !data.groupCode || !data.proficiency) {
            console.error('Received invalid setProficiency event payload:', data);
            return;
        }
        const { groupCode, proficiency } = data;
        const group = groups[groupCode];
        if (group) {
            // Ensure the person setting proficiency is the host (first player)
            if (group.players[0] && group.players[0].id === socket.id) {
                group.proficiency = proficiency;
                console.log(`Proficiency for group ${groupCode} set to ${proficiency} by host.`);
            }
        }
    });

    socket.on('startGameRequest', (data) => {
        if (!data || !data.groupCode) {
            console.warn(`Invalid startGameRequest payload received: ${data}`);
            return;
        }
        const { groupCode, proficiency } = data;
        const group = groups[groupCode];
        
        // Centralized validation for the request
        if (!group) {
            console.warn(`Start game request for non-existent group: ${groupCode}`);
            return;
        }
        if (!group.players[0] || group.players[0].id !== socket.id) {
            console.warn(`Unauthorized start game request for group: ${groupCode} by socket: ${socket.id}`);
            return;
        }
        if (group.gameStarted) {
            console.warn(`Game already started for group: ${groupCode}`);
            return;
        }

        // Use proficiency from host's request, fallback to group state, then to a default.
        const finalProficiency = proficiency || group.proficiency || 'beginner';
        group.proficiency = finalProficiency;

        // Mark game as started and notify players
        group.gameStarted = true;
        console.log(`Starting game for group ${groupCode} with proficiency: ${group.proficiency}`);
        io.to(groupCode).emit('gameStarted', { proficiency: group.proficiency });
    });

    socket.on('updateScore', (playerData) => {
        if (!playerData || !playerData.groupCode || !playerData.id || typeof playerData.score === 'undefined') {
            console.error('Invalid updateScore payload received:', playerData);
            return;
        }
        const { groupCode, id, score } = playerData;
        const group = groups[groupCode];
        if (group) {
            const player = group.players.find(p => p.id === id);
            if (player) {
                player.score = score;
                io.to(groupCode).emit('updatePlayers', group.players);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const groupCode in groups) {
            const group = groups[groupCode];
            const playerIndex = group.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                group.players.splice(playerIndex, 1);
                console.log(`Removed player from group ${groupCode}`);
                
                if (group.players.length === 0) {
                    delete groups[groupCode];
                    console.log(`Group ${groupCode} is empty and has been deleted.`);
                } else {
                    io.to(groupCode).emit('updatePlayers', group.players);
                }
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});