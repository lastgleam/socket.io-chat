var dir = '/Users/donghee_kim/mediado/repositories/socket.io-sandbox';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(dir + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('chat message', function (name, msg) {
        io.emit('chat message', name, msg);
    });
});

http.listen(30000, function () {
    console.log('listening on *:30000');
});