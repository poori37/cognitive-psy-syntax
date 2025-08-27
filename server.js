



const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

// Serve static files from the project's root directory.
// This allows the server to host the frontend (index.html, etc.).
app.use(express.static(__dirname));

// Add a health check route for the hosting platform, moved to /health to avoid conflict with index.html
app.get("/health", (req, res) => {
    res.status(200).send({ status: "ok" });
});

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});