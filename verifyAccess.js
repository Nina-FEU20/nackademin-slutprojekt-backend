const jwt = require('jsonwebtoken')

module.exports = async function (req, res, next) {

    const token = req.cookies['auth-token']
    if (!token) return res.status(401).send('Access denied')

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);

        // redundant?? 
        req.user = verified;

        console.log(verified)

        if (verified.user.role !== "admin") {
            return res.status(401).send('Access denied. You are not admin')
        }
        next();
    } catch (err) {
        res.status(400).send("invalid token")
    }
}
