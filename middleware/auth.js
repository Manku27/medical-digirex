const jwt = require('jsonwebtoken')
const User = require('../models/user')


//middleware to verify the token and header
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '') //bearer token, the structure is "Bearer <token>" so just replace 'bearer' with an empty string
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) //also token to check if the user is signed in

        if (!user) {
            throw new Error()
        }
        //assigning fetched user so that route handlers can directly access this instead of looking for it again
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth