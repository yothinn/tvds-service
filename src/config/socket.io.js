module.exports.connection = function (http) {

    var io = require('socket.io')(http);

    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    
        socket.on('my message', (msg) => {
            console.log('message: ' + msg);
            io.emit('my broadcast', `server: ${msg}`);
        });
    });

    exports.io = io;
}