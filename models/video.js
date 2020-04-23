const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    title:String,
    thumbnail:String,
    link:String,
    owner:String
},{versionKey:false})

module.exports = mongoose.model('Video',videoSchema)