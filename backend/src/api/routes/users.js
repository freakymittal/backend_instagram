var express = require('express');
var router = express.Router();
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User=require('../../models/users')
const auth=require('../Controllers/middleware/Auth/auth')
const {transporter}=require('../Controllers/config/mail')
const nodemailer = require('nodemailer')
const {forgotPasswordPublicKey,email_user,emailPublicKey,tokenPublicKey,expiresIn}=require('../Controllers/config/env')

//for getting data
router.post('/forgot-password',async (req, res) => {
    let {email, newPassword} = await req.body
    console.log("New Password",newPassword)
    let emailVerification = await jwt.sign({email:email}, forgotPasswordPublicKey,{
        expiresIn: expiresIn
    })
    console.log(emailVerification);
    await User.findOne({email: email}).then(user => {
        if (user) {
            var mailOptions = {
                from: email_user,
                to: email,
                subject: 'Verify Your Mail',
                html: `<h1><h2>${user.username}!</h2> Verify it's you</h1>
                        <h4>A request for changing password was made. Click the link below to verify.</h4>
                        <a href="http://localhost:3010/users/forgot-password?token=${emailVerification}&password=${newPassword}">Verify</a>`
            }
            transporter.sendMail(
                mailOptions, (err, info) => {
                    if (err) {
                        console.log('Error: ', err)
                    } else {
                        console.log('Verification mail send to the mail')
                        return res.status(200).json({"Message": "Successfully Verified!!", "User": this.user})

                    }
                })
        }
    })
})
router.get('/forgot-password',async (req, res) => {
    let token = await req.query.token
    let newPass = await req.query.password
    console.log(newPass)
    await jwt.verify(token, forgotPasswordPublicKey, async (err, payload) => {
        if (err) {
            return res.status(403).json({'error': 'Unauthorized Entry'})
        } else {
            let {email}=payload
            console.log("payload", payload)
            let user=await bcrypt.hash(newPass, 16).then(async hashed => {
                console.log(hashed)
                await User.findOneAndUpdate({email: email}, {
                    password: newPass,
                    hash: hashed
                })

            })
            res.status(200).json({"message":"Changed Password"})
        }
    })
})
router.post('/signup',(req,res)=>{
  const {username,email,password}=req.body;
  if(!username || !email||!password){
    return res.status(404).json({'error':'Some of the fields are incomplete'});
  }
    User.findOne({username:username}).then((present)=>{
    if(!present){
         bcrypt.hash(password,16).then(async (hashed) => {
             const user = new User({
                 username: username, email: email, password: password, hash: hashed,
             })
             let emailVerification = jwt.sign({_id: user.id}, emailPublicKey,{
                 expiresIn:expiresIn
             });
             user.save().then(async user => {
                 const mailOpts = {
                     from: email_user,
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
    jwt.verify(token, emailPublicKey, async (err, payload) => {
        if (err) {
            return res.status(403).json({'error': 'Unauthorized Entry'})
        } else {
            const {_id} = payload
            console.log(payload)
            await User.findByIdAndUpdate(_id, {
                email_verified: true
            })
            res.status(200).send(`Congratulations you have verifed`)
        }
    })
    } )
router.get('/:id',auth,(req,res)=>{
    User.findById(req.params.id).then(user=>{
        res.json({'message':'Welcome ','Your username':req.user.username,"Searched Username":user.username})
    })
})
router.get('/', auth,async function (req, res, next) {
    const {search} = req.body;
    let searchPatt = new RegExp("^" + search)
    User.find({
        $or: [
            {email: {$regex: searchPatt}},
            {username: {$regex: searchPatt}}
        ]
    },).limit(100).then(user=>{
        if(user){
            res.status(200).json(user);
        }
        else{
            res.status(400).json({"message":"Something went wrong"});
        }
    })
});
router.put('/:id',auth,async (req, res) => {
    const {username, email, password} = await req.body
    await bcrypt.hash(password, 16,async (err, hashed) => {
        await User.findByIdAndUpdate(req.params._id,
            {
                email: email,
                username: username,
                password: password,
                hash: hashed,
                updated_at: Date.now()
            })
            return res.json({'message': 'changed'})

    })

})

module.exports = router;
