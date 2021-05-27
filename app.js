const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const cookieParser = require('cookie-parser')

app.use(express.static('public'))
// So we can read information that sends in as json
app.use(express.json())
// So we can read information that sends in as urlencoded
app.use(express.urlencoded({ extended: true }))
// So we can parse the cookies
app.use(cookieParser())

//import routes
const authRoute = require('./routes/authRoute')
const productRoute = require('./routes/productRoute')
const registerRoute = require('./routes/registerRoute')
const orderRoute = require('./routes/orderRoute')

// routes
app.use('/api/auth', authRoute)
app.use('/api/orders', orderRoute)
app.use('/api/products', productRoute)
app.use('/api/register', registerRoute)

// connection to our database
mongoose.connect(process.env.MONGODB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, dbName: 'Sinus' })
    .then(() => {
        console.log("Connected to db")
    })
    .catch(err => {
        console.log(err)
    })

module.exports = app;