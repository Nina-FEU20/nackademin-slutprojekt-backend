const jwt = require('jsonwebtoken')

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


module.exports = { verifyIsAdmin, verifyIsLoggedIn }
