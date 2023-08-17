const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

let timers = {};

io.on('connection', function(socket) {
    socket.on('start', function(data) {
        startTimer(data);
    });

    function startTimer(data) {
        let timer = data.time;
        let timerId = data.timerId;
        
        timers[timerId] = setInterval(() => {
            timer--;

            io.sockets.emit('time', { time: timer, timerId: timerId });

            if (timer <= 0) {
                clearInterval(timers[timerId]);
                delete timers[timerId];

                io.sockets.emit('end', timerId);
            }
        }, 1000);
    }
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

server.listen(3000, function() {
    console.log('App is running on http://localhost:3000');
});