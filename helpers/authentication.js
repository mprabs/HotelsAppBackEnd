const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const token = req.header('auth_token');
    if(!token) return res.status(401).send("Access denied !");
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send(error);
    }
}