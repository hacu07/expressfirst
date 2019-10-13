const mongoose = require('mongoose')

// Modelo de datos embebido
const saleSchema = new mongoose.Schema({
    user:{
        // indica los campos a almacenar del schema 'User' para no guardar todos
        type: new mongoose.Schema({
            name: String,
            email: String 
        }),
        required: true
    },
    car: {
        // indica los campos a almacenar del schema 'Car' para no guardar todos
        type: new mongoose.Schema({
            model: String // solo va a almacenar el modelo del coche
        }),
        required: true
    },
    price: Number,
    date:{
        type: Date,
        default: Date.now
    }
})


const Sale = mongoose.model('sale', saleSchema)

module.exports = Sale