const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {addUser, getCurrentUser, removeUser, getUsersInRoom} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const chatBot = 'Chatty';

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when a client connects
io.on('connection', socket => {
    console.log("hello");
    socket.on('joinRoom', ({username, room}) => {
        console.log(username);
        console.log(room);
        const user = addUser(socket.id, username, room);
        socket.join(user.room);

        //Notify the user when they successfully connect
        socket.emit('message', formatMessage(chatBot, 'Welcome to Chatty!'));

        //Broadcast to others when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has joined the chat.`));

        //Update users in the room
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
    });

    //Emit user's messages to everyone
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Notify everyone when a user disconnects
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has left the chat.`));
        }

        //Update users in the room
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
    });
});

//Set Server Port
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));