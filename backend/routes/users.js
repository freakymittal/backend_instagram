var express = require('express');
var router = express.Router();
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User=require('../Schema/users')
const auth=require('../Auth/auth')
const {transporter}=require('../config/mail')
/* GET users listing. */
const nodemailer = require('nodemailer')
// const transporter=nodemailer.createTransport({
//     service:'gmail',
//     auth:{
//         user:'wolowitzhoward618@gmail.com',
//         pass:'PassworD@101'
//     },
//     tls:{
//         rejectUnauthorized:false
//     }
// })

router.get('/', function(req, res, next) {
  res.json({"message":'respond with a resource'});
});

router.post('/signup',(req,res)=>{
  const {username,email,password}=req.body;
  if(!username || !email||!password){
    return res.status(404).json({'error':'Some of the fields are incomplete'});
  }
    User.findOne({username:username}).then((present)=>{
    if(!present){
         bcrypt.hash(password,16).then(async (hashed) => {
             const user = new User({
                 username: username, email: email, password: hashed, hash: hashed,
             })
             let emailVerification = jwt.sign({_id: user.id}, 'notAGreatIdea@120202',{
                 expiresIn:'30m'
             });
             user.save().then(async user => {
                 const mailOpts = {
                     from: 'bosepriyangshu2001@gmail.com',
                     to: email,
                     subject: 'Verify Your Mail',
                     html: `<h1><h2>${username}!</h2> Thanks For registering</h1>
                        <h4>Please verify the mail through this link</h4>
                        <a href="http://localhost:3010/users/email_verify?token=${emailVerification}"> Verify your mail</a>`
                 };
                 await transporter.sendMail(
                     mailOpts, (err, info) => {
                         if (err) {
                             console.log('Error: ', err)
                         } else {
                             console.log('Verification mail send to the mail')
                             return res.status(200).json({"Message": "Successfully Verified!!", "User": this.user})

                         }
                     }
                 )

             })

         });

    }
    else{
      return res.status(404).json({'error':'Email already present'});
    }
  })
});

router.get('/email_verify',(req,res)=>{
    let token = req.query.token;
    jwt.verify(token, "notAGreatIdea@120202", (err, payload) => {
        if (err) {
            return res.code(403).json({'error': 'You have to be logged in'})
        } else {
            const {_id} = payload
            console.log(payload)
            User.findById(_id).then(userdata => {
                userdata.email_verified=true;
                console.log("Verified");
                res.send(`Congratulations you have verifed`)
            })

        }
        })
    } )
router.get('/:id',auth,(req,res)=>{
    User.findById(req.params.id).then(user=>{
        res.json({'message':'Welcome ','Your username':req.user.username,"Searched Username":user.username})
    })
})
router.put('/:id',auth,((req, res) => {
    const {username,email,password}=req.body
    bcrypt.hash(password,16).then(hashed=>{
        User.findOneAndUpdate({
                username:req.user.username
            },
            {
                email:email,
                username:username,
                password:hashed,
                hash:hashed,
                updated_at:Date.now()
            }).then(user=>{
            return res.json({'message':'changed','user':user})
        })
    })

}))
module.exports = router;
