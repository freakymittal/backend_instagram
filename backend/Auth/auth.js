const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User=require('../Schema/users')
module.exports=(req,res,next)=>{
     const {authorization}=req.headers
    if(!authorization){
        return res.code(403).json({'error':'You have to be logged in'})
    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,"InsTa_CloNe124626232gs",(err,payload)=>{
        if(err){
            return res.code(403).json({'error':'You have to be logged in'})
        }
        else{
            const {_id}=payload
            console.log(payload)
            User.findById(_id).then(userdata=>{
                req.user=userdata
            })
        }
        next();
    })
}