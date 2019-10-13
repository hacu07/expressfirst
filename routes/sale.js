const express = require('express')
const Sale = require('../models/sale')
const User = require('../models/user')
const Car = require('../models/car')
const mongoose =  require('mongoose')
// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()

router.get('/', async(req,res)=>{
    // obtiene todas las ventas
    const sales = await Sale.find()
    res.send(sales)
})

router.post("/", async(req,res)=>{
    // anter de registrar la venta valida si existe el usuario y el coche

    // valida existencia de usuario
    const user = await User.findById(req.body.userId)
    // usuario no existe
    if(!user) return res.status(400).send('Usuario no existe')

    // valida existencia de coche
    const car = await Car.findById(req.body.carId)
    // coche no existe
    if(!car) return res.status(400).send('Coche no existe')

    // valida que el coche no ha sido vendido en el campo 'sold' del modelo 'Car'
    if(car.sold === true) return res.status(400).send('Ese coche ya ha sido vendido')

    const sale = new Sale({
        user:{
            _id: user._id,    // asigna id el objeto usuario encontrado en BD para que no lo agregue por defecto
            name: user.name,
            email: user.email
        },
        car:{
            _id : car._id,
            model: car.model
        },
        price: req.body.price
    })

    /********************************************************
     Valida si realizo el registro
     Si una falla no se ejecuta ninguna,
     si todas funcionan continua
    *********************************************************/
    const session  = await mongoose.startSession()
    session.startTransaction()
    try{
        // guarda registro
        const result = await sale.save()

        // registra el usuario como cliente por haber realizado una compra
        user.isCustomer = true
        user.save()

        // registra que el coche ha sido vendido
        car.sold = true
        car.save()
        
        // Ejecuta transaccion y valida que se ejecute correctamente
        // si no, el error es capturado por el catch
        await session.commitTransaction()
        session.endSession()

        res.status(201).send(result)
    }catch(e){
        // Si no se logro almacenar/actualizar registros
        await session.abortTransaction()
        session.endSession()
        // Response error del servidor
        res.status(500).send(e.message)
    }

})

module.exports = router