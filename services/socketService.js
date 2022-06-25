const socketIO = require("socket.io");
var userServices = require('../services/userService');
var videoCallService = require('./videoCallService');

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
        socket.on("join", async function (data) {
            socket.join(data.roomId);
            const videoToken = await videoCallService.generateRTCToken(data.roomId, data.sender.userId, 'publisher', 'uid');
            userServices.createRoom({
                name: data.roomId,
                pageUrl: data.pageUrl,
                ownerId: data.sender.userId,
                visibility: data.visibility,
            });
            socket.emit('videoToken', {
                videoToken: videoToken.token,
            });
            socket.broadcast.to(data).emit("join", {
                pageId: 'NONE',
                sender: data.sender,
            });
            socket.on("play", function (message) {
                socket.broadcast.to(data).emit("play", {
                    pageId: message.pageId,
                    time: message.time,
                    sender: message.sender,
                });
            });
            socket.on("pause", function (message) {
                socket.broadcast.to(data).emit("pause", {
                    pageId: message.pageId,
                    time: message.time,
                    sender: message.sender,
                });
            });
            socket.on("seek", function (message) {
                socket.broadcast.to(data).emit("seek", {
                    pageId: message.pageId,
                    time: message.time,
                    sender: message.sender,
                });
            });
            socket.on("message", function (message) {
                socket.broadcast.to(data).emit("message", {
                    pageId: message.pageId,
                    text: message.text,
                    sender: message.sender,
                });
            });
            socket.on("reaction", function (message) {
                socket.broadcast.to(data).emit("reaction", {
                    pageId: message.pageId,
                    name: message.name,
                    sender: message.sender,
                });
            });
        })
    });
}