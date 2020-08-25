const express = require('express');
const router = express.Router();
module.exports = router;

const Booking = require('../models/booking');

router.post('/', async(req, res) => {
    var booking = new Booking({
        user: req.body.user,
        hotel: req.body.hotel,
        contact: req.body.contact,
        numberOfRooms: req.body.numberOfRooms,
        bookFrom: req.body.bookFrom,
        bookTo: req.body.bookTo
    })

    const newBooking = (await booking.populate('user').save());
    res.send(newBooking);
})

router.get('/', async(req, res) => {
    const booking = await Booking.find()
    .populate('user')
    .populate('hotel')
    .exec();
    res.send(booking);
})

router.get('/:id', async(req, res) => {
    const booking = await Booking.findById(req.params.id)
    .populate('user')
    .populate('hotel')
    .exec();
    res.send(booking);
})

router.delete('/:id',getBooking, async(req,res) => {
    await res.booking.remove();
    res.json({message: "Successfully deleted !"})
})

async function getBooking(req, res, next) {
    let booking
    try {
        booking = await Booking.findById(req.params.id);
        if(booking == null) {
            return res.status(400).json({ message: "Booking not found" })
        }
        booking.remove();
    }

    catch (err) {
        res.status(400).json({ message: err.message })
    }
    res.booking = booking;
    next();
}