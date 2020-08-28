require('dotenv').config()

const express = require('express');
const app = express()
const mongoose = require('mongoose')
var cors = require('cors');
app.use(cors());
const DATABASE_URL="mongodb+srv://dbUser:h8haBjtD56HpaNP@cluster0.vmnbl.mongodb.net/HotelsApp?retryWrites=true&w=majority"
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error',(error) => console.error(error))
db.once('open',() => console.log('Connected to database !'))

app.use(express.json())

app.listen(8081, () => console.log('Server started!'));

const hotelsRouter = require('./routes/hotels')
app.use('/hotels', hotelsRouter)

const loginRouter = require('./routes/users')
app.use('/users', loginRouter)

const BookingRouter = require('./routes/bookings')
app.use('/bookings', BookingRouter);