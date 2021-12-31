const nodemailer = require('nodemailer')
const {email_user,email_pass}=require('../env')
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:email_user,
        pass:email_pass
    },
     tls:{
        rejectUnauthorized:false
     }
})
exports.transporter=transporter;