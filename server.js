require('dotenv').config()

const express = require('express');
const app = express()
const mongoose = require('mongoose')
var cors = require('cors');
app.use(cors());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error',(error) => console.error(error))
db.once('open',(error) => console.log('Connected to database !'))

app.use(express.json())

const hotelsRouter = require('./routes/hotels')

app.use('/hotels', hotelsRouter)

app.listen(8080, () => console.log('Server started!'));
