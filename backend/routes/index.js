var express = require('express');
const User = require("../Schema/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('Welcome! This is Instagram clone');
});
router.post('/login',(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return res.status(404).json({'error':'Some of the fields are incomplete'});
    }
    User.findOne({email:email}).then(user=>{
        bcrypt.compare(password,user.password).then(matched=>{
            const token=jwt.sign({_id:user.id},"InsTa_CloNe124626232gs");
            res.json({"token":token})
        })
    })
});
module.exports = router;
