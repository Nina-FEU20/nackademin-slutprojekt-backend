const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//import routes
const authRoute = require('./routes/authRoute')

// routes
app.use('/api/auth', authRoute)

// connection to MY LOCAL DATABASE / Nina
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'SinusWebshop' })
    .then(() => {
        console.log("Connected to db")
    })
    .catch(err => {
        console.log(err)
    })

module.exports = app