const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const chatBot = 'Chatty'

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when a client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        //Notify the user when they successfully connect
        socket.emit('message', formatMessage(chatBot, 'Welcome to Chatty!'));

        //Broadcast to others when a user connects
        socket.broadcast.emit('message', formatMessage(chatBot, 'A user has joined the chat.')); 
    });

    //Emit user's messages to everyone
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    });

    //Notify everyone when a user disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(chatBot, 'A user has left the chat.'));
    });
});

//Set Server Port
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));