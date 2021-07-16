const express = require('express')
const Disease = require('../models/disease')
const auth = require('../middleware/auth')
const router = new express.Router()

//medical-record-api endpoint to post data
router.post('/diseases', auth, async(req,res) => {
    const disease = new Disease({
        ...req.body,
        user:req.user._id
    })

    try {
        await disease.save()
        res.status(201).send(disease)
    } catch(e) {
        res.status(400).send(e)
    }
})

//search api endpoint
router.get('/diseases', auth, async (req, res) => {
    const match = {}

    if(req.query.name){
        match.name = req.query.name;
    }
    
    if(req.query.to){
        match.to = req.query.to;
    }
    if(req.query.from){
        match.from = req.query.from;
    }

    try {
        // Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s)
        // using populates removes the necessity to check if this is the user which created the task
        await req.user.populate({
            path: 'diseases',
            match
            }).execPopulate()
            //existing mongoose document and want to populate some of its paths
            // Need to call `execPopulate()` to actually execute the `populate()`.
            res.send(req.user.diseases)
    } catch (e){
        res.status(500).send()
    }
})

module.exports = router;