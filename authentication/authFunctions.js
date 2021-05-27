const jwt = require('jsonwebtoken')
const User = require('../models/user')

// function to create a token and setting it to cookies
const createToken = async (user, res) => {
    // filling the payload with information about the user, so we can reach it through the token later in other routes
    const payload = {
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // makes the token valid for one hour
        role: user.role,
        id: user._id,
    }
    // create and assign a token
    const token = await jwt.sign(payload, process.env.TOKEN_SECRET)
    // setting the token as a cookie so we can reach it from all routes
    res.cookie('auth-token', token)
    return token;
}

// function to set the end-response 
const authEndPointResponse = async (email, token) => {
    // getting the user again, but excluding everything we dont want inside the Auth End-Point Response using projection queries
    const user = await User.findOne({ email: email }, { password: 0, orderHistory: 0, __v: 0, _id: 0 })
    // creating an object with the token and user (can use a shortcut because using the same name) and then returning it
    const response = { token, user }
    return response;
}

module.exports = { createToken, authEndPointResponse }