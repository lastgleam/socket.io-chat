'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(30000, function () {
    console.log('listening on *:30000');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var rooms = {};

io.on('connection', function (socket) {
    var socket_id = socket.id;
    socket.emit('roomlist', rooms);

    console.log(socket.id + ' has connected');
    io.to(socket.id).emit('getId', socket.id);

    socket.on('disconnect', function () {
        socket.emit('user disconnected');
        console.log(socket.id + ' has disconnected');
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
        socket.in(roomName).emit(socket_id, roomName);
        var info = {
            'status': 'join',
            'socket_id': socket_id,
            'roomName': roomName
        };
        console.log(socket_id + ' has joined to ' + roomName);
        socket.in(roomName).emit('info', info);
        socket.emit('roomlist', rooms);
        console.log('rooms', rooms);
    });

    socket.on('leave', function (roomName, user) {
        socket.leave(roomName);
        var index = rooms[roomName].indexOf(user.socket_id);
        rooms[roomName].splice(index, 1);
        if (rooms[roomName].length < 1) {
            delete rooms[roomName];
            console.log(rooms);
        }
        var info = {
            'status': 'leave',
            'socket_id': socket_id,
            'roomName': roomName
        };
        console.log(user.socket_id + ' has left from ' + roomName);
        socket.in(roomName).emit('info', info);
        socket.emit('roomlist', rooms);
        console.log('rooms', rooms);
    });

    socket.on('rooms', function () {
        socket.emit('roomlist', rooms);
    });

    socket.on('send', function (data) {
        io.in(data.roomName).emit('publish', data);
    });
});
//# sourceMappingURL=index.js.map