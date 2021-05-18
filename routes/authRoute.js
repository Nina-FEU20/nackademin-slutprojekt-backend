const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

// temporary user
const tempUser = {
    _id: '6b521d3f-3d15...', // add server side
    email: 'johan.kivi@zocom.se',
    password: '$$$hashed password$$$',
    name: 'Johan Kivi',
    role: 'customer', // or customer
    adress: {
        street: 'Tokitokvägen 3',
        zip: '123 45',
        city: 'Tokberga'
    },
    orderHistory: ["orderId1", "orderId2"]
}

// route for logging in and getting your auth token
router.post('/', async (req, res) => {

    // find user in database and checking that it exists
    const user = tempUser; // temporary
    // const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Email doesn't exist")

    // checking if the password matches the hashed password in the database
    const correctPassword = req.body.password === user.password // Temporary
    // const correctPassword = await bcrypt.compare(req.body.password, user.password)
    if (!correctPassword) return res.status(400).send('Invalid Password')


    const payload = {
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
    res.cookie('auth-token', token)
    res.json({ user, token })
})

// // just for checking that I get the token for now
router.post('/check', async (req, res) => {
    const token = req.cookies['auth-token']

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload) => {
        if (err) return res.json(err)

        console.log(payload.user.role)
    })

    res.send("TEST - getting the token from header: " + token)
})

module.exports = router;