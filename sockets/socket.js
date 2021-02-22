// usernames which are currently connected to the chat
const usernameList = [];

// rooms which are currently available in chat
var rooms = ['Sala 001','Sala 002','Sala 003'];

const connect = (cliente) => {
	cliente.on('connected', (payload) => {
        console.log('connected: ' + payload.username);
		// store the username in the socket session for this client
		cliente.username = payload.username;
		// store the room name in the socket session for this client
		cliente.room = payload.roomName;
		// add the client's username to the global list
		usernameList.push(payload.username);
		// send client to room 1
		cliente.join(payload.roomName);
		// echo to client they've connected
		// cliente.emit('updatechat', { type: 1, username: '', message: `te has conectado a ${payload.roomName}.`});
		// echo to room 1 that a person has connected to their room
		cliente.broadcast.to(payload.roomName).emit('updatechat', { type:1, username: payload.username, message: `${payload.username} ingresó a la sala.`});
		cliente.emit('updaterooms', rooms, payload.roomName);
	});
}

const disconnect = (cliente) => {
    cliente.on('disconnect', () => {
        console.log('disconnecting');
    });
}

const leave = (cliente) => {
    cliente.on('leave', (payload) => {
        console.log('leave: ' + payload.username);
		// remove the username from global usernames list
        const indexItem = usernameList.findIndex(p => p === payload.username);
        usernameList.splice(indexItem, 1);
		// update list of users in chat, client-side
		// cliente.emit('updateusers', usernameList);
		// echo globally that this client has left
		cliente.broadcast.to(payload.roomName).emit('updatechat', { type:4, username: payload.username, message: `${payload.username} salió de la sala.`});
		cliente.leave(payload.roomName);
        cliente.disconnect();
    });
}

const pause = (cliente) => {
    cliente.on('pause', () => {
        console.log('pause');
        cliente.broadcast.emit('paused');
    });
}

const play = (cliente) => {
    cliente.on('play', payload => {
        console.log(JSON.stringify(payload) + 'for play event');
        cliente.broadcast.emit('played', payload);
    });
}

const sendChat = (cliente, socket) => {
	// when the client emits 'sendchat', this listens and executes
	cliente.on('sendchat', (payload) => {
        console.log('sendchat:' + JSON.stringify(payload));
		// we tell the client to execute 'updatechat' with 2 parameters
		socket.in(cliente.room).emit('updatechat', { type: 2, username: cliente.username, message: payload});
	});
}

const switchRoom = (cliente) => {
    cliente.on('switchRoom', (newroom) => {
        cliente.leave(cliente.room);
        cliente.join(newroom);
        cliente.emit('updatechat', { username: '', message: 'Te has conectado a  '+ newroom });
        // sent message to OLD room
        cliente.broadcast.to(socket.room).emit('updatechat', { username: cliente.username, message: 'ha dejado la sala.'});
        // update socket session room title
        cliente.room = newroom;
        cliente.broadcast.to(newroom).emit('updatechat', { username: cliente.username, message: 'se ha unido a esta sala.'});
        cliente.emit('updaterooms', rooms, newroom);
    });
}

module.exports = {
    connect,
    disconnect,
    leave,
    pause,
    play,
    sendChat,
    switchRoom
}