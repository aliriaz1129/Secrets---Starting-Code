//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
mongoose.connect("mongodb://localhost:27017/usersDB",{ useNewUrlParser: true,useUnifiedTopology: true } );
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
const userschema= new mongoose.Schema({
  email:String,
  password:String
});
const secret="This is our secret."
userschema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User= new mongoose.model("User",userschema);

app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
    const username=req.body.username;
    const pass=req.body.password;
    const newUser= new User({
        email:username,
        password:pass
    });
    newUser.save(function(err){
       if(err){
         console.log(err);
       }
       else{
         res.render("secrets");
       }
    });

});
app.post("/login",function(req,res){
  const username=req.body.username;
  const pass=req.body.password;

  User.findOne({email:username},function(err,Users){

      if(Users){
        if(Users.password===pass)
        {
          res.render("secrets");
        }
        else
        {
          res.send("Incorrect Password");
        }
      }
      else{
        res.send("Incorrect Email or Password");
      }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
