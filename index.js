const app = require('./app');
const port = process.env.PORT;

// starting the server
app.listen(port, ()=> {
    console.log("server on port"+ port);
})

