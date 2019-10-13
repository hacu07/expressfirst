const mongoose = require('mongoose')
const {companySchema} =  require('./company') // obtiene solo el companySchema
//Creacion del schema coche
const carSchema = new mongoose.Schema({
    //parametros de validacion de schema

    // PARA USAR DE MANERA EMBEBIDA
    company:{
        type: companySchema,
        required: true
    },
    
    /* 
    PARA USAR DE MANERA NORMALIZADA
    company:{
        type: mongoose.Schema.Types.ObjectId, // objeto id del documento 'company'
        ref: 'company' // referencia a la coleccion del id (debe ser igual a como se llamo en el modelo)
    },*/
    model: String,
    sold: Boolean,
    price:{
        type: Number,
        required: function(){
            return this.sold
        }
    },
    year:{
        type: Number,
        min: 2000,
        max: 2030,

    },
    extras: [String],
    date: {
        type:Date,
        default: Date.now
    }
})

// Creacion del clase modelo ('Nombre de la coleccion', schema creado para la coleccion)
const Car = mongoose.model('car', carSchema )

//Exporta el modelo para que sea utilizado en routes/car.js
module.exports = Car