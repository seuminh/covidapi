const mongoose = require('mongoose');

const userSymptomSchema = mongoose.Schema({
    id:String,
    symptoms:[
        {
            date: String,
            symptom: String
        }
    ]
},{versionKey:false})

module.exports = mongoose.model('UserSymptom',userSymptomSchema)