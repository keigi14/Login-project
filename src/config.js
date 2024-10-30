const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/login-tut");

//checkout connect built or not
connect.then(() => {
    console.log("Database connected successfully");
})
.catch(() => {
    console.log("Database cannot be connected");
});

// create a schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true
    }
});


//collection part

const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;