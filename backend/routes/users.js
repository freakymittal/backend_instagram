var express = require('express');
var router = express.Router();
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User=require('../Schema/users')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({"message":'respond with a resource'});
});
router.post('/signup',(req,res)=>{
  const {username,email,password}=req.body;
  if(!username || !email||!password){
    return res.status(404).json({'error':'Some of the fields are incomplete'});
  }
    User.findOne({username:username}).then((user)=>{
    if(!user){
         bcrypt.hash(password,16).then((hashed)=>{
            const user =new User({
              username:username,email:email,password:hashed,hash:hashed,
            })
           user.save().then(user=>{
             res.status(200).json({"Message":"Successfully Registered!!","User":user})
           })
         });
    }
    else{
      return res.status(404).json({'error':'Email already present'});
    }
  })
});

module.exports = router;
