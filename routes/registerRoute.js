const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const router = express.Router()
const { createToken, authEndPointResponse } = require('../authentication')


router.post('/', async (req, res) => {

    // Check if email already exists in database, to reduce duplicates
    if (!await User.exists({ email: req.body.email })) {

        // Check if passwords match then sprinkle some salt and hash the password
        if (req.body.password === req.body.repeatPassword) {
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds = 10);

            // fetching data from req.body to create a new database entry
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hashedPassword,
                name: req.body.name,
                role: 'customer',
                adress: {
                    street: req.body.adress.street,
                    zip: req.body.adress.zip,
                    city: req.body.adress.city
                }
            })
            // creates a new database entry and returns status code if successful or not
            try {
                await user.save()
                // creating token with help of function createToken
                const token = await createToken(user, res)
                // creating a auth-end response to send to frontend
                const response = await authEndPointResponse(user.email, token)
                return res.json(response)
            }
            catch (err) {
                console.log(err)
                return res.status(500).json({
                    error: 'User not added to database',
                    msg: err
                })
            }
        }
        else {
            return res.status(401).json({ password: 'Passwords does\'nt match' })
        }
    }
    else {
        // if email already exists, return error
        return res.status(409).json({ error: 'Email already exists' })
    }
})

module.exports = router;