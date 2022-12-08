const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const roomUsers = document.getElementById('users');

// Get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io.connect('http://localhost:3000');

//Join chat
socket.emit('joinRoom', {username, room});

//Get room and users
socket.on('roomUsers', ({room, users}) => {
    getRoomName(room);
    getRoomUsers(users);
});

//Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get message text
    let msg = e.target.elements.msg.value;
    msg = msg.trim();
    if (!msg) {
        return false;
    }

    //Emit message to the server
    socket.emit('chatMessage', msg);

    //Clear input field after a message is sent
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                    <p class="text">
                        ${message.text}
                    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Show room name on DOM
function getRoomName(room) {
    roomName.innerText = room;
}

//Show the users in the room on DOM
function getRoomUsers(users) {
    roomUsers.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}