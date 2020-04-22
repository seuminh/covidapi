const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:String,
    password:String,
    phone:String
},{versionKey:false})

module.exports = mongoose.model('User',userSchema)