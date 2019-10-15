const Role = require('../helpers/role')
const autorize = require('../middleware/role')
const auth = require('../middleware/auth')
const express = require('express')
const Car = require('../models/car')
const {Company} = require('../models/company')
// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');


// Se creo modelo en models/car.js

// retorna todos los documentos obtenidos de la coleccion cars 
router.get('/', [auth, autorize([Role.Admin, Role.Editor])], async (req,res)=>{
    // 'cars' = almacena los documentos coches obtenidos de la BD
    const cars = await Car
                .find()
                // usado para modelo de datos normalizados
                //.populate('company', 'name country') // obtiene los datos de la coleccion "companies" segun el id enviado
    res.send(cars)

});


// retorna documento segun id enviado por parametro
router.get('/:id', async (req,res)=>{
    const car = await Car.findById(req.params.id)   // Busca el documento por parametro id obtenido
    // si no existe...
    if(!car){
        return res.status(404).send('No hemos encontrado un coche ese ID')
    }
    // Existe...
    res.send(car)
})


/****************************
 * METHOD: POST
 * se obtiene los parametros por req.body
 * *****************************/

/*
    Validacion de datos enviados por parametros
    con  "express-validator"
*/

//      POST MODELO DE DATOS EMBEBIDO
router.post('/', [   
    // validacion de datos con "express-validator"
    check('model').isLength({min:2})    // mayor a 2 caracteres
], async (req, res)=>{
    // Valida si ocurrio alun error en la validacion
    const errors = validationResult(req);
    if(!errors.isEmpty()){ // encontro errores
        return res.status(422).json(
                { errors: errors.array()}
            );
    }

    //  Busca si existe la compañia
    const company = await Company.findById(req.body.companyId)
    //  No existe
    if(!company)  return res.status(400).send('No tenemos ese fabricante')  // No permite guardar el coche

    //  si continua, no encontro error
    //  guarda coche en BD

    // crea objeto con datos tomados de los parametros enviados por el cliente
    const car = new Car({
        company: company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
    })
    // guarda en bd
    const result = await car.save()

    res.status(201).send(result)
})

//      POST DE MODELO DE DATOS NORMALIZADOS
/*router.post('/', [   
    // validacion de datos con "express-validator"
    check('model').isLength({min:2})    // mayor a 2 caracteres
], async (req, res)=>{
    // Valida si ocurrio alun error en la validacion
    const errors = validationResult(req);
    if(!errors.isEmpty()){ // encontro errores
        return res.status(422).json(
                { errors: errors.array()}
            );
    }

    //  si continua, no encontro error
    // guarda coche en BD

    // crea objeto con datos tomados de los parametros enviados por el cliente
    const car = new Car({
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
    })
    // guarda en bd
    const result = await car.save()

    res.status(201).send(result)
})*/

/*
                METHOD: PUT
    Validacion de datos enviados por parametros
    con  "express-validator"
*/
router.put('/:id', 
[   // validacion de datos con "express-validator"
    check('company').isLength({min:3}),         // valida si es un correo
    check('model').isLength({min:2})            // mayor a 3 caracteres
], async (req, res)=>{
    // Valida si ocurrio alun error en la validacion
    const errors = validationResult(req);
    if(!errors.isEmpty()){ // encontro errores
        return res.status(422).json(
                { errors: errors.array()}
            );
    }

    //  Documentacion https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    //  Valida si existe en el array el coche con el id enviado por parametros
    //  y actualiza si lo encuentra
    const car = await Car.findByIdAndUpdate(req.params.id,{
        // campos a actualizar
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
    }, {
        new: true   // Devuele el documento con datos modificados
    })

    if(!car){ // si no encontro el coche por id en la bd
        return res.status(404).send('El coche con ese ID no existe.');
    }

    //  si continua, no encontro error
    //  retorna respuesta
    res.status(204).send()
})

/*********************************************
 *                  METHOD: DELETE
 * ***************************************** */
router.delete('/:id', async (req,res)=>{

    //  Valida si existe en la BD el coche con el id enviado por parametros
    const car = await Car.findByIdAndDelete(req.params.id);

    if(!car){ // no encontro el coche por id en la bd
        return res.status(404).send('El coche a borrar con ese ID no esta.');
    }

    res.status(200).send("coche borrado")
})

/* EXPORTA EL MODULO */
module.exports =  router