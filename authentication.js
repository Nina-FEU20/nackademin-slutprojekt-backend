const jwt = require('jsonwebtoken')
const User = require('./models/user')

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

// MIDDLEWARES
// Checks if a user is logged in
const verifyIsLoggedIn = async (req, res, next) => {

    // getting the current token from cookies
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).send("Access denied")

    try {
        // verifying the token with the jwt-verifymethod by sending in the token and our secret
        const verifiedUser = await jwt.verify(token, process.env.TOKEN_SECRET);
        // sending the verifiedUser into the req-object, so wherever we use this middleware we can reach it
        req.verifiedUser = verifiedUser;
        next();
    } catch (err) {
        res.status(401).send(err.message)
    }
}

// Checks if a user has the role of admin
const verifyIsAdmin = async (req, res, next) => {
    // checking if the user is admin, and if so, calling next() to move on to the next middleware/route - otherwise, the request will be left hanging. else, access is denied. 
    req.verifiedUser.role !== "admin" ? res.status(401).send('Access denied. You are not admin') : next();

}


module.exports = { createToken, authEndPointResponse, verifyIsAdmin, verifyIsLoggedIn }
