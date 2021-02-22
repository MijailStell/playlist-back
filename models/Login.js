const { Schema, model } = require('mongoose');

const LoginSchema = Schema({
    usuario: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    genderId: {
        type: String,
        required: true
    }
});


module.exports = model('Login', LoginSchema );

