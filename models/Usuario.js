const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    genderId: {
        type: Number,
        required: true
    }
});


module.exports = model('Usuario', UsuarioSchema );

