const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    hotel: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
    }],
    contact: {
        type: String,
        required: true
    },
    numberOfRooms: {
        type: String,
        required: true
    },
    bookFrom: {
        type: String,
        required: true
    },
    bookTo: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Booking', bookingSchema)
