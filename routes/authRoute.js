const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { createToken, authEndPointResponse } = require('../authentication')

// route for logging in and getting your auth token
router.post('/', async (req, res) => {

    // find user in database and checking that it exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Email doesn't exist")

    // checking if the password matches the hashed password in the database
    const correctPassword = await bcrypt.compare(req.body.password, user.password)
    if (!correctPassword) return res.status(400).send('Invalid Password')

    // creating token with help of function createToken
    const token = await createToken(user, res)
    // creating a auth-end response to send to frontend
    const response = await authEndPointResponse(user.email, token)
    res.json(response)

})


module.exports = router;