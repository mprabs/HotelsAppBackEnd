const express = require('express')
const router = express.Router()
const authentication = require('../helpers/authentication')
const Hotel = require('../models/hotel')

module.exports = router

router.get('/', async (req, res) => {
    try{
        const hotels = await Hotel.find()
        res.send(hotels)
    }

    catch (err) {
        res.status(500).json({ message: err.message }) //500 : error on server
    }
})


router.get('/:id', getHotel, (req, res) => {
    res.json(res.hotel)
})


router.post('/', async(req, res) => {
    var hotel = new Hotel({
        name: req.body.name,
        address: req.body.address,
        number: req.body.number,
        image: req.body.image
    });

    try {
        const newhotel = await hotel.save()
        res.status(201).json(newhotel) // 201: successful
        next();
    }
    catch (err) {
        res.status(400).json(hotel)
    }
})


router.patch('/:id', getHotel, async (req, res) => {
    if(req.body.name != null) {
        res.hotel.name = req.body.name
    }

    if(req.body.address != null) {
        res.hotel.address = req.body.address
    }

    if(req.body.number != null) {
        res.hotel.number = req.body.number
    }

    if(req.body.image != null) {
        res.hotel.image = req.body.image
    }
    try {
        const updatedHotel = await res.hotel.save()
        res.status(200).json(updatedHotel)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})


router.delete('/:id', getHotel, async (req, res) => {
    try {
        await res.hotel.remove()
        res.json({message: 'Successfully deleted'})
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getHotel (req, res, next) {
    let hotel
    try {
        hotel = await Hotel.findById(req.params.id)
        if(hotel == null) {
            return res.status(404).json({message: 'Cannot find the hotel'})
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.hotel = hotel;
    next();
}