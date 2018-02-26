const express = require('express');
const app = express();
const server = require('http').Server(app);
const options = {
    pingTimeout: 60000,
    pingInterval: 3000
};
const io = require('socket.io')(server, options);

server.listen(30000, () => {
    console.log('listening on *:30000');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const users = {};
const rooms = {};

io.on('connection', socket => {
    const socket_id = socket.id;
    users[socket_id] = {};
    socket.emit('roomlist', rooms);

    console.log(socket.id + ' has connected');
    io.to(socket.id).emit('getId', socket.id);
    console.log('users', users);
    console.log('rooms', rooms);

    socket.on('disconnect', () => {
        socket.emit('user disconnected');
        let user = users[socket.id];
        if (rooms[user.roomName] && rooms[user.roomName].includes(socket.id)) {
            let user = users[socket_id];
            let index = rooms[user.roomName].indexOf(socket.id);
            delete user.roomName;
            rooms[user.roomName].splice(index, 1);
        }
        console.log(socket.id + ' has disconnected');
        console.log('users', users);
        console.log('rooms', rooms);
    });

    socket.on('join', (roomName, user) => {
        socket.join(roomName);
        if (rooms[roomName]) {
            if (!rooms[roomName].includes(user.socket_id)) {
                rooms[roomName].push(user.socket_id);
            }
        } else {
            rooms[roomName] = [user.socket_id];
        }
        users[user.socket_id] = user;
        socket.in(roomName).emit(socket_id, roomName);
        const info = {
            'status': 'join',
            'socket_id': socket_id,
            'roomName': roomName
        };
        console.log(socket_id + ' has joined to ' + roomName);
        socket.in(roomName).emit('info', info);
        socket.emit('roomlist', rooms);
        console.log('users', users);
        console.log('rooms', rooms);
    });

    socket.on('leave', (roomName, user) => {
        socket.leave(roomName);
        if(rooms[roomName] && rooms[roomName].includes(user.socket_id)){
            let index = rooms[roomName].indexOf(user.socket_id);
            rooms[roomName].splice(index, 1);
            delete users[user.socket_id].roomName;
            if (rooms[roomName].length < 1) {
                delete rooms[roomName];
                console.log(rooms);
            }
            let info = {
                'status': 'leave',
                'socket_id': socket_id,
                'roomName': roomName
            };
            console.log(user.socket_id + ' has left from ' + roomName);
            socket.in(roomName).emit('info', info);
            socket.emit('roomlist', rooms);
            console.log('users', users);
            console.log('rooms', rooms);
        }else{
            console.log(socket.id + "is not entered to any rooms.");
        }
    });

    socket.on('rooms', () => {
        socket.emit('roomlist', rooms);
    });

    socket.on('send', data => {
        io.in(data.roomName).emit('publish', data);
    });
});