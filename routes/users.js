require('dotenv').config();
const express = require('express')
const router = express.Router()
module.exports = router
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation } = require('../helpers/validator');

// REGISTER NEW USER
router.post('/register', async(req, res) => {

    // VALIDATION
    const { error } = registerValidation(req.body);
    if(error)
        return res.status(404).json({ message: error.details[0].message });

    // CHECK IF EMAIL EXISTS
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).json({ message: "Email already exists." });

    // PASSWORD HASHING
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // CREATE A NEW USER
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    // SAVE USER IN THE DATABASE
    try {
        const savedUser = await user.save();
        res.send({ id: savedUser._id});
    } catch (error) {
        res.status(400).send({ message: error.message});
    }  
})

// USER LOGIN
router.post('/login', async(req,res) => {
    if(!req.body)
        return res.status(400).json({ message: "Details can't be empty" })

    // VALIDATION
    const { error } = loginValidation(req.body);
    if(error)
        return res.status(404).json({ message: error.details[0].message });

    // CHECK IF EMAIL EXISTS
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).json({ message: "Email doesn't exist !" });

    // CHECK PASSWORD
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).json({ message: "Password Incorrect !" })

    // CREATE AND ASSIGN TOKEN
    const TOKEN = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN)
    res.header('auth_token', TOKEN).send({ token: TOKEN, name: user.name, id: user._id });

})

// GET LIST OF USERS
router.get('/', async(req,res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// GET A USER DATA
router.get('/:id', getUser, async(req, res) => {
    try {
        res.send(res.user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE A USER
router.delete('/:id', getUser, async(req, res) => {
    try {
        await res.user.remove();
        res.json({ message: "Successfully deleted!" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// FIND A USER
async function getUser (req, res, next) {
    let user
    try {
        user = (await User.findById(req.params.id))
        if(user == null) {
            return res.status(404).json({message: 'Cannot find the user'})
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.user = user;
    next();
}