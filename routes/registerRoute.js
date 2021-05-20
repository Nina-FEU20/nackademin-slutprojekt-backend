const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const router = express.Router()


router.post('/', async (req, res) => {
    
    // Check if email already exists in database, to reduce duplicates
    const email = await User.exists({ email: req.body.email});
      
    if(!email) {

        // Sprinkle some salt and hash over the password
        const hash = await bcrypt.hash(req.body.password, saltRounds = 10);
        
        // fetching data from req.body to create a new database entry
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

        // creates a new database entry and returns status code if successful or not
        user.save((err) => {
            if(err){
                return res.status(400).json({
                    error: 'User not added to database',
                    msg: err
                    })
            }
            else {
                return res.status(200).json({ success: 'User was added to database' })
            }
        })
     }
     else {
         // if email already exists, return error
        return res.status(400).json({ error: 'Email already exists' })
     }
})

module.exports = router;