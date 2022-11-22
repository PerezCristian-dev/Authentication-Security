require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');


const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema( {
    email:String,
    password: String
});





userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

app.get('/', (req, res)=>{
 res.render('home');
});

app.get('/login', (req, res)=>{
    res.render('login');
});

app.get('/register', (req, res)=>{
    res.render('register');
});

app.post('/login', (req, res)=>{
    const {username: email, password} = req.body;

    // console.log({email, password})
   

    User.findOne({email}, (err, foundUser)=>{
        if(err){
            console.log(err);
        }else if(foundUser && foundUser.password === password){
            console.log('User and Password matched.')
            res.render('secrets');
        }
    })
});


app.post('/register', (req, res)=>{
    const {username: email, password} = req.body;

    console.log({email, password})
    const newUser = new User({email, password});

    newUser.save((err)=>{
        if(err){
            console.log(err);
        }else{
            console.log('user added to database.')
            res.render('secrets');
        }
    })
})
   
   

app.listen(process.env.PORT, ()=>{
    console.log('Server Running in port 3000');
});