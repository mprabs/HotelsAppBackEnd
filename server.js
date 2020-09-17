require('dotenv').config()

const express = require('express');
const app = express()
const mongoose = require('mongoose')
var cors = require('cors');
app.use(cors());
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error',(error) => console.error(error))
db.once('open',() => console.log('Connected to database !'))

app.use(express.json())

app.listen(8081, () => console.log('Server started!'));

app.get('/', () => {
    res.send('Try /hotels');
})

const hotelsRouter = require('./routes/hotels')
app.use('/hotels', hotelsRouter)

const loginRouter = require('./routes/users')
app.use('/users', loginRouter)

const BookingRouter = require('./routes/bookings')
app.use('/bookings', BookingRouter);