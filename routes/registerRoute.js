const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const router = express.Router()


router.post('/', async (req, res) => {
    
   // Sprinkle some salt and hash over the password
     const hash = await bcrypt.hash(req.body.password, saltRounds = 10);
     
            const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
            name: req.body.name,
            role: 'customer',
            adress: {
                street: req.body.adress.street,
                zip: req.body.adress.zip,
                city: req.body.adress.city
            }
        })

        user.save((error) => {
            if(error) return console.log(error);
        })

    
})

module.exports = router;