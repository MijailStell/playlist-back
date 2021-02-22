const express = require('express');
require('dotenv').config();
const cors = require('cors');
let webpush = require('web-push');
const { dbConnection } = require('./database/config');
const { connect, disconnect, leave, pause, play, sendChat, switchRoom } = require('./sockets/socket');

// Crear el servidor de express
const app = require('express')();

// Base de datos
dbConnection();

// CORS
app.use(cors())

// Directorio Público
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Rutas
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );

// Escuchar peticiones
const server = app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});

// Socket Layer over Http Server
const socket = require('socket.io')(server);
// On every Client Connection
socket.on('connection', cliente => {
    console.log('connecting');
    connect(cliente);
    disconnect(cliente);
    leave(cliente);
    pause(cliente);
    play(cliente);
    sendChat(cliente, socket);
    switchRoom(cliente);
});