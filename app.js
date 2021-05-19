const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json())

//import routes
const authRoute = require('./routes/authRoute')
const productRoute = require('./routes/productRoute')
const orderRoute = require('./routes/orderRoute')

// routes
app.use('/api/auth', authRoute)
app.use('/api/orders', orderRoute)
app.use('/api/products', productRoute)

// connection to MY LOCAL DATABASE / Nina
mongoose.connect(process.env.MONGODB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, dbName: 'Sinus' })
    .then(() => {
        console.log("Connected to db")
    })
    .catch(err => {
        console.log(err)
    })

module.exports = app