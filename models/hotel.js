const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: false
    },
    image: {
        type: Buffer,
        required: false
    }
})

module.exports = mongoose.model('Hotel', hotelSchema)