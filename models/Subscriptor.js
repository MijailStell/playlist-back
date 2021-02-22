const { Schema, model } = require('mongoose');

const SubscriptorSchema = Schema({
    endpoint: {
        type: String,
        required: true
    },
    expirationTime: {
        type: Number
    },
    keys: {
        type: Object,
        required: true
    },
});


module.exports = model('Subscriptor', SubscriptorSchema );

