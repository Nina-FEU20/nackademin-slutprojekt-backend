const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

// route for logging in and getting your auth token
router.post('/', async (req, res) => {

    // find user in database and checking that it exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Email doesn't exist")

    // checking if the password matches the hashed password in the database
    const correctPassword = await bcrypt.compare(req.body.password, user.password)
    if (!correctPassword) return res.status(400).send('Invalid Password')

    // filling the payload with information about the user, so we can reach it through the token later in other routes
    const payload = {
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        user: {
            email: user.email,
            name: user.name,
            role: user.role,
            adress: {
                street: user.adress.street,
                zip: user.adress.zip,
                city: user.adress.city
            }
        }
    }

    // create and assign a token
    const token = await jwt.sign(payload, process.env.TOKEN_SECRET);
    // setting the token as a cookie
    res.cookie('auth-token', token)
    // getting the user again, but this time excluding the password by passing a projection parameter (Because we dont want to send password to frontend)
    const userWithoutPassword = await User.findOne({ email: user.email }, "-password")
    res.json({ user: userWithoutPassword, token: token })
})


module.exports = router;