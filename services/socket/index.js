const socketIO = require("socket.io");
var userServices = require('../../services/user');

module.exports.createSocket = function (server) {
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

    io.on("connection", function (socket) {
        socket.on("join", function (room) {
            socket.join(room);
            userServices.createRoom({
                name: 'foo',
                pageUrl: 'bar',
                ownerId: 1,
                visibility: 'visible'
            });
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
            socket.on("reaction", function (message) {
                socket.broadcast.to(room).emit("reaction", {
                    pageId: message.pageId,
                    name: message.name
                });
            });
        })
    });
}