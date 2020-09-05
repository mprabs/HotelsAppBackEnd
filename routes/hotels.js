const express = require('express')
const router = express.Router()
const authentication = require('../helpers/authentication')
const Hotel = require('../models/hotel')

module.exports = router

router.get('/', paginatedResults(Hotel), async (req, res) => {
    try {
        res.json(res.paginatedResults)
    } catch (e) {
        res.status(500).json({ message: e.message })
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
        image: req.body.image,
        description: req.body.description
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

    if(req.body.description != null) {
        res.hotel.description = req.body.description
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


function paginatedResults(model) {
    return async(req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {}
    
        if(endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
    
        if(startIndex > 0) {
            results.prev = {
                page: page - 1,
                limit: limit
            }
        }

        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec()
        } catch (e){
            res.status(500).json({ message: e.message })
        }
        res.paginatedResults = results
        next()
    }
}