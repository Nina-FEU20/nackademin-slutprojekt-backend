const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const cookieParser = require('cookie-parser')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

//import routes
const authRoute = require('./routes/authRoute')
const productRoute = require('./routes/productRoute')
const productRoute2 = require('./routes/productRoute2')
const registerRoute = require('./routes/registerRoute')

// routes
app.use('/api/auth', authRoute)

app.use('/api/products', productRoute)
app.use('/api/products', productRoute2)

app.use('/api/register', registerRoute)

// connection to MY LOCAL DATABASE / Nina
mongoose.connect(process.env.MONGODB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, dbName: 'Sinus' })
    .then(() => {
        console.log("Connected to db")
    })
    .catch(err => {
        console.log(err)
    })

module.exports = app;