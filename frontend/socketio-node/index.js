/*https://deepinder.me/creating-a-real-time-chat-app-with-vue-socket-io-and-nodejs

---------- Socket.io Server ------------------------------------------------------
- node inde.js --> starts the server

*/

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:5173']
  }
});

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
    console.log('user connected with', socket.id);

    

    socket.on('disconnect', () => {
        console.log('user disconnected with', socket.id);
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('my broadcast', `server: ${msg}`);
    });
});

http.listen(3002, () => {
    console.log('listening on *:3002');
});