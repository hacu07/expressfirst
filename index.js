const mongoose = require('mongoose')    // para MongoDB
const express = require('express')      // para peticiones
const app = express()
const car = require('./routes/car')
const user = require('./routes/user')
const company = require('./routes/company')
const sale = require('./routes/sale')
//Para usar los datos de tipo JSON -- IMPORTANTE
app.use(express.json());
// cada vez que usa el modulo car indica el endpoint direcciondolo a los metodos de car.js, user.js
app.use('/api/cars/', car)
app.use('/api/user/', user)
app.use('/api/company/', company)
app.use('/api/sale/', sale)
const port = process.env.PORT || 3004
app.listen(port, () => console.log('Escuchando puerto:' +port))

//Conecta a BD - Devuelve una promise
mongoose.connect('mongodb://localhost/carsdb',{useNewUrlParser:true, useFindAndModify:false})
    .then( ()=>console.log('Conectado a MongoDB') )
    .catch( erro => console.log('No se ha conectado a MongoDB') )