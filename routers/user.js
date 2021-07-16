const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

//signup, takes basic info as mentioned in the model and returns a token
router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
});

//signin, returns a token
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        //user ip
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //user bworser
        const browser = req.headers['user-agent']
        //[todo]save these two
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
});

//logout endpoint
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })// deleting that specific token to log the user out of that particular session and no others
        // true means it is a different token and is kept, not deleted
        //false delets that token
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router

//the user events will have to be sent by client side preferably, but page loads can be stored wrt what endpoints are being called