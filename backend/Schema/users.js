const mongoose=require('mongoose');
const joi=require('joi');
const bcrypt=require('bcrypt');

const userschema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    password:{
        type:String,
        required:true,
        minLength: 6,
        maxLength: 300
    },
    email_verified:{
      type:Boolean,
        default: 0
    },
    hash:{
        type:String,
        required:true,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },

});