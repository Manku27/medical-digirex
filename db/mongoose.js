const mongoose = require('mongoose');

//instantiating connection to mongodb via mongoose 

mongoose.connect(process.env.MONGODB_URL , {
    useNewUrlParser: true, //?
    useCreateIndex: true //?
})