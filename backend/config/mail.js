const nodemailer = require('nodemailer')
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'wolowitzhoward618@gmail.com',
        pass:'PassworD@101'
    },
     tls:{
        rejectUnauthorized:false
     }
})
exports.transporter=transporter;