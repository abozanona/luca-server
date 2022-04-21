const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const corsOptions = {
    credentials: true, // This is important.
    origin: (origin, callback) => {
        return callback(null, true)
    }
}


const server = express()
    .use(cors(corsOptions))
    .use((req, res) => {
        res.header('Access-Control-Allow-Credentials', true);
        res.sendFile(INDEX);
    })
    .listen(PORT, () => console.log("Listening on localhost:" + PORT));

const io = socketIO(server, {
    cors: {
        origin: "*",
        credentials: false,
        handlePreflightRequest: (req, res) => {
            res.writeHead(200, {
                "Access-Control-Allow-Credentials": true
            });
            res.end();
        }
    },
    allowRequest: (req, callback) => {
        const noOriginHeader = req.headers.origin === undefined;
        callback(null, true);
    }
});

io.engine.on("headers", (headers, req) => {
    headers["Access-Control-Allow-Origin"] = "*"
    headers["Access-Control-Allow-Headers"] = "origin, x-requested-with, content-type"
    headers["Access-Control-Allow-Methodsn"] = "PUT, GET, POST, DELETE, OPTIONS"
    headers["Access-Control-Allow-Credentials"] = true
})

// Register "connection" events to the WebSocket
io.on("connection", function (socket) {
    // Register "join" events, requested by a connected client
    socket.on("join", function (room) {
        socket.join(room)
        socket.on("play", function (message) {
            socket.broadcast.to(room).emit("play", {
                pageId: message.pageId,
                time: message.time
            });
        });
        socket.on("pause", function (message) {
            socket.broadcast.to(room).emit("pause", {
                pageId: message.pageId,
                time: message.time
            });
        });
        socket.on("seek", function (message) {
            socket.broadcast.to(room).emit("seek", {
                pageId: message.pageId,
                time: message.time
            });
        });
        socket.on("message", function (message) {
            socket.broadcast.to(room).emit("message", {
                pageId: message.pageId,
                text: message.text
            });
        });
    })
});