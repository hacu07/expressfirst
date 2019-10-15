const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    isCustomer: {
        type:Boolean,
        default: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: Boolean, // no es necesario porque ya existe rol, si se cambia modificar middelware 'admin'
    role: String,
    date:{
        type: Date, 
        default: Date.now
    }
})

// Se crea una variable de entorno para almacenar la 'semilla'
/*
    1. abrir consola y escribir comando: export 'NOMBRE_VARIABLE_ENTORNO'='VALOR_VARIABLE'
      ej: export SECRET_KEY_JWT_CAR_API = 1234
        si es windows cmd cambiar export por set
*/

// funcion para JWT
userSchema.methods.generateJWT = function(){
    return jwtToken = jwt.sign({
        _id: this._id,
        name: this.name,
        isAdmin: this.isAdmin,
        role: this.role
    },
    // clave privada 'semilla'
    process.env.SECRET_KEY_JWT_CAR_API)
}

//Crea moedlo
const User = mongoose.model('user', userSchema)

module.exports = User