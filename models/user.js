const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//schema and models are created separately even though mongoose does it behind the scenes is to make use of mongoose middlewhere, here save

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim: true //?
    },
    email : {
        type: String,
        unique: true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        // minlength: 7,
        trim: true,
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value<0){
                throw new Error('inappropriate age');
            }
        }
    },
    tokens : [{
        token: {
            type: String,
            required:true
        }
    }],   
}, {
    timestamps: true
});

userSchema.virtual('myDiseases', {
    ref:'Disease',
    localField: '_id',
    foreignField: 'user'
});

userSchema.methods.toJSON = function() {
    //toJSON is called at JSON.stringify, which is called on res.send()
    const user = this
    const userObject = user.toObject()

    //to hide sensitive information which is not needed
    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id:user._id.toString()/*what needs to be stored in the token*/}, 
    process.env.JWT_SECRET, /*checks tampering with the jwt*/
    {expiresIn: '7 hours'});
    //returns string with two decimals, all base64 encoded
    //part1: header, metadata, algo
    //part2: the data in the object that is stored, can be seen by decoding, not confidential
    //part3: the secret string used for verification
    user.tokens = user.tokens.concat({token});
    //concatinating to the array as stated in the model
    await user.save();

    return token;
}

//statics are methods which exist on the model directly, and not on an instance like methods

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//hash the password before saving

//mongoose middlewere to run before save events
//cant use arrow functions as they dont bind 'this'
userSchema.pre('save', async function (next) {
    //binding 'this' user, the current document in the collection 
    const user = this

    if (user.isModified('password')) {
        //isModified as it is true while creating and updating
        user.password = await bcrypt.hash(user.password, 8)
        // 8 is the optimal no of rounds, lesser are easier to decipher more take more time
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User