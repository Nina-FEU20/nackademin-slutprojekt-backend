const jwt = require('jsonwebtoken')

const verifyIsAdmin = async (req, res, next) => {

    const token = req.cookies['auth-token']
    if (!token) return res.status(401).send('Access denied')

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);

        if (verified.user.role !== "admin") {
            return res.status(401).send('Access denied. You are not admin')
        }
        next();
    } catch (err) {
        res.status(400).send("invalid token")
    }
}

const verifyIsLoggedIn = async (req, res, next) => {

    const token = req.cookies['auth-token'];
    if (!token) {
        return console.log("You need to log in to access this page")
    }

    try {
        const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);
        req.verifiedUser = verifiedUser;
        next();
    } catch (err) {
        res.status(400).json({ msg: err })
    }
}

module.exports = { verifyIsAdmin, verifyIsLoggedIn }
