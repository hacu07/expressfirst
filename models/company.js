const mongoose = require('mongoose')

const companySchema =  new mongoose.Schema({
    name:{
        type:String,
        require: true,
        minlength: 1,
        maxlength: 99,

    },
    country: String,
    date:{
        type: Date,
        default: Date.now
    }
})

const Company = mongoose.model('company', companySchema)

module.exports.Company = Company        // exporta clase modelo 
module.exports.companySchema = companySchema    // exporta schema para usar en modelo de datos embebidos