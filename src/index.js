const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const { clear } = require("console");

const app = express();
//convert data into json format
app.use(express.json());

//use express URL encoded method
app.use(express.urlencoded({extended: false}));

//use EJS as a view engine
app.set('view engine','ejs');
// static file
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

//register User
app.post("/signup",async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    //if user already exist in the data base
    const existing = await collection.findOne({name:data.name});

    if(existing) {
        res.send("User already exists. please choose a different username.");
    }else{
    //hashing password using bcrypt
    const saltRounds = 10; //Number of saltround
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; //Replace the password with the original password.

    //send this data into database
    const userdata = await collection.insertMany(data);
    //console.log data in terminal to show which data we should send
    console.log(userdata);
    }
});

// login user
app.post("/login", async (req, res) => {
    try{
        const check = await collection.findOne({name: req.body.username}); //checking user in database
        if(!check) {
            res.send("Username Cannot be Found"); // message if user not found.
        }

        //compare the hash password from the database with the plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){
            res.render("home"); //if password matches continue to homepage
        }else {
            req.send("wrong password"); // If not then show this message to the user
        }
    }catch{
        res.send("wrong Details");
    }
});
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})