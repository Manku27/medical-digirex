const mongoose = require('mongoose')

const diseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim: true
    },
    from: {
        type: Date,
        required : true,
        trim: true
    },
    to: {
        type: Date,
        required : true,
        trim: true
    },
    description: {
        type: String,
        required : true,
        trim: true
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    }
    },{
        timestamps:true
})

const Disease = mongoose.model('Disease', diseaseSchema)

module.exports = Disease;