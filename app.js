const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const cookieParser = require('cookie-parser')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//import routes
const authRoute = require('./routes/authRoute')

// routes
app.use('/api/auth', authRoute)

// connection to MY LOCAL DATABASE / Nina
mongoose.connect(process.env.MONGODB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'Sinus' })
    .then(() => {
        console.log("Connected to db")
    })
    .catch(err => {
        console.log(err)
    })

module.exports = app