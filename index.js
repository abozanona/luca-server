const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
    .use((req, res) => res.sendFile(INDEX))
    .listen(PORT, () => console.log("Listening on localhost:" + PORT));

const io = socketIO(server);

// Register "connection" events to the WebSocket
io.on("connection", function (socket) {
    // Register "join" events, requested by a connected client
    socket.on("join", function (room) {
        socket.join(room)
        socket.on("play", function (message) {
            socket.broadcast.to(room).emit("play", {
                time: message.time
            });
        });
        socket.on("pause", function (message) {
            socket.broadcast.to(room).emit("pause", {
                time: message.time
            });
        });
        socket.on("seek", function (message) {
            socket.broadcast.to(room).emit("seek", {
                time: message.time
            });
        });
        socket.on("message", function (message) {
            socket.broadcast.to(room).emit("seek", {
                text: message.text
            });
        });
    })
});