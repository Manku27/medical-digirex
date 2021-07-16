const express = require('express');
const cors = require('cors');
//?
require('./db/mongoose');
const userRouter = require('./routers/user');
const diseaseRouter = require('./routers/disease');

//instantiating express
const app = express();

//cors middleware
app.use(cors());

//parses json requests like body-parser
//why parse?
app.use(express.json());
//custom routes
app.use(userRouter);
app.use(diseaseRouter);

module.exports = app;