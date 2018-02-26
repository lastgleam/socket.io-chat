'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var options = {
    pingTimeout: 60000,
    pingInterval: 3000
};
var io = require('socket.io')(server, options);

server.listen(30000, function () {
    console.log('listening on *:30000');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var users = {};
var rooms = {};

io.on('connection', function (socket) {
    var socket_id = socket.id;
    users[socket_id] = {};

    console.log(socket.id + ' has connected');
    io.to(socket.id).emit('getId', socket.id);
    console.log('users', users);
    console.log('rooms', rooms);
    io.emit('rooms', rooms);

    socket.on('disconnect', function () {
        io.emit('user disconnected');
        var user = users[socket.id];
        if (rooms[user.roomName] && rooms[user.roomName].includes(socket.id)) {
            var index = rooms[user.roomName].indexOf(socket.id);
            rooms[user.roomName].splice(index, 1);
            delete user.roomName;
        }
        delete users[socket.id];
        Object.keys(rooms).forEach(function (index) {
            if (rooms[index].length < 1) {
                delete rooms[index];
            }
        });
        console.log(socket.id + ' has disconnected');
        console.log('users', users);
        console.log('rooms', rooms);
        io.emit('rooms', rooms);
    });

    socket.on('join', function (roomName, user) {
        socket.join(roomName);
        if (rooms[roomName]) {
            if (!rooms[roomName].includes(user.socket_id)) {
                rooms[roomName].push(user.socket_id);
            }
        } else {
            rooms[roomName] = [user.socket_id];
        }
        users[user.socket_id] = user;
        io.in(roomName).emit(socket_id, roomName);
        var info = {
            'status': 'join',
            'user': user
        };
        console.log(socket_id + ' has joined to ' + roomName);
        console.log('users', users);
        console.log('rooms', rooms);
        io.in(roomName).emit('info', info);
        io.emit('rooms', rooms);
    });

    socket.on('leave', function (roomName, user) {
        socket.leave(roomName);
        if (rooms[roomName] && rooms[roomName].includes(user.socket_id)) {
            var index = rooms[roomName].indexOf(user.socket_id);
            if (index !== null && index !== undefined) {
                rooms[roomName].splice(index, 1);
                delete users[user.socket_id].roomName;
            }
            if (rooms[roomName].length < 1) {
                delete rooms[roomName];
                console.log(rooms);
            }
            var info = {
                'status': 'leave',
                'user': user,
                'roomName': roomName
            };
            console.log(user.socket_id + ' has left from ' + roomName);
            socket.in(roomName).emit('info', info);
            console.log('users', users);
            console.log('rooms', rooms);
        } else {
            console.log(socket.id + "is not entered to any rooms.");
        }
        io.emit('rooms', rooms);
    });

    socket.on('rooms', function () {
        io.emit('rooms', rooms);
    });

    socket.on('send', function (data) {
        io.in(data.roomName).emit('publish', data);
        io.emit('rooms', rooms);
    });

    socket.on('change', function (data) {
        console.log('chaging!!', data);
        io.in(data.user.roomName).emit('changeInfo', data);
    });

    function leave() {}
});
//# sourceMappingURL=index.js.map