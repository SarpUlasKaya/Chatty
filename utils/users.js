const users = [];

//Add user to chat
function addUser(id, username, room) {
    const user = {id, username, room};
    users.push(user);
    return user;
}

//Get the current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//Remove user from chat
function removeUser(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//Get all users in the chat room
function getUsersInRoom(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    addUser,
    getCurrentUser,
    removeUser,
    getUsersInRoom
}