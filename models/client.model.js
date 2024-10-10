const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    name: { type: String, required: false },
    email: { type: String, required: false },
    contact: { type: String, required: false },
}, {
    timestamps: true,
});

const Client = mongoose.model('Client', exerciseSchema);

module.exports = Client;