const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
<<<<<<< Updated upstream
=======
app.use(cookieParser())
app.use(express.json())
>>>>>>> Stashed changes

//import routes
const authRoute = require('./routes/authRoute')
const productRoute = require('./routes/productRoute')
const orderRoute = require('./routes/orderRoute')

// routes
app.use('/api/auth', authRoute)
app.use('/api/orders', orderRoute)
app.use('/api/products', productRoute)

// connection to MY LOCAL DATABASE / Nina
<<<<<<< Updated upstream
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'SinusWebshop' })
=======
mongoose.connect(process.env.MONGODB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, dbName: 'Sinus' })
>>>>>>> Stashed changes
    .then(() => {
        console.log("Connected to db")
    })
    .catch(err => {
        console.log(err)
    })

module.exports = app