const express = require('express')
const User = require('../models/user')
// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');


// Se creo modelo en models/user.js

// retorna todos los documentos obtenidos de la coleccion cars 
router.get('/',async (req,res)=>{
    // 'cars' = almacena los documentos coches obtenidos de la BD
    const users = await User.find()
    res.send(users)

});


// retorna documento segun id enviado por parametro
router.get('/:id', async (req,res)=>{
    const user = await User.findById(req.params.id)   // Busca el documento por parametro id obtenido
    // si no existe...
    if(!user){
        return res.status(404).send('No hemos encontrado un usuario ese ID')
    }
    // Existe...
    res.send(user)
})


/****************************
 * METHOD: POST
 * se obtiene los parametros por req.body
 * *****************************/

/*
    Validacion de datos enviados por parametros
    con  "express-validator"
*/
router.post('/', [   
    // validacion de datos con "express-validator"
    check('name').isLength({min:3}),        // valida si es un correo
    check('email').isEmail()                // Si es un correo
], async (req, res)=>{
    // Valida si ocurrio alun error en la validacion
    const errors = validationResult(req);
    if(!errors.isEmpty()){ // encontro errores
        return res.status(422).json(
                { errors: errors.array()}
            );
    }

    //  si continua, no encontro error
    // guarda USUARIO en BD

    // crea objeto con datos tomados de los parametros enviados por el cliente
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        isCustomer: req.body.isCustomer
    })
    // guarda en bd
    const result = await user.save()

    res.status(201).send(result)
})

/*
                METHOD: PUT
    Validacion de datos enviados por parametros
    con  "express-validator"
*/
router.put('/:id', 
[   // validacion de datos con "express-validator"
    check('name').isLength({min:3}),         // valida si es un correo
    check('email').isEmail()
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
    const user = await User.findByIdAndUpdate(req.params.id,{
        // campos a actualizar
        name: req.body.name,
        email: req.body.email,
        isCustomer: req.body.isCustomer
    }, {
        new: true   // Devuele el documento con datos modificados
    })

    if(!user){ // si no encontro el usuario por id en la bd
        return res.status(404).send('El usuario con ese ID no existe.');
    }

    //  si continua, no encontro error
    //  retorna respuesta
    res.status(204).send()
})

/*********************************************
 *                  METHOD: DELETE
 * ***************************************** */
router.delete('/:id', async (req,res)=>{

    //  Valida si existe en la BD el usuario con el id enviado por parametros
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user){ // no encontro el usuario por id en la bd
        return res.status(404).send('El usuario a borrar con ese ID no esta.');
    }

    res.status(200).send("usuario borrado")
})

/* EXPORTA EL MODULO */
module.exports =  router